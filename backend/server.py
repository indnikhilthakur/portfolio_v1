from fastapi import FastAPI, APIRouter, BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict
import uuid
from datetime import datetime, timezone
import urllib.request
import json
import re
import asyncio

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

_client = None
_db = None

def get_client():
    global _client
    if _client is None:
        mongo_url = os.environ['MONGO_URL']
        _client = AsyncIOMotorClient(mongo_url)
    return _client

def get_db():
    global _db
    if _db is None:
        db_name = os.environ.get('DB_NAME', 'portfolio_db')
        _db = get_client()[db_name]
    return _db

# --- Globe Stats Models ---
class ProjectStatItem(BaseModel):
    name: str
    commits: int
    stargazers: int
    updated_at: str
    color: str

class PracticeStats(BaseModel):
    leetcode_commits: int
    hackerrank_commits: int
    total: int

class GlobeStatsResponse(BaseModel):
    projects: Dict[str, ProjectStatItem]
    practice: PracticeStats
    cached_at: str

# --- GitHub Fetcher Helper Functions ---
def fetch_commit_count(owner: str, repo: str, headers: dict) -> int:
    try:
        # Rapid commit count estimation via paginated Link header (per_page=1)
        url = f"https://api.github.com/repos/{owner}/{repo}/commits?per_page=1"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as res:
            link_header = res.headers.get("Link", None)
            if link_header:
                match = re.search(r'page=(\d+)>;\s*rel="last"', link_header)
                if match:
                    return int(match.group(1))
            
            commits_list = json.loads(res.read().decode())
            return len(commits_list)
    except Exception as e:
        logger.error(f"Error fetching commit count for {repo}: {e}")
        return 5  # safe small fallback

def fetch_github_stats_sync(username: str = "indnikhilthakur"):
    token = os.environ.get("GITHUB_TOKEN", None)
    headers = {
        "User-Agent": "Portfolio-Data-Globe-Agent"
    }
    if token:
        headers["Authorization"] = f"token {token}"
        
    try:
        # 1. Fetch repositories
        url = f"https://api.github.com/users/{username}/repos?per_page=100"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as res:
            repos = json.loads(res.read().decode())
            
        project_stats = {}
        practice_leetcode = 0
        practice_hackerrank = 0
        
        # Simple mapping mapping for our mock project IDs
        repo_mapping = {
            "flow": "p01",
            "coridors": "p01",
            "rag": "p02",
            "assistant": "p02",
            "ingestion": "p03",
            "connector": "p03",
            "carl": "p04",
            "investment": "p04",
            "drone": "p05",
            "delivery": "p05",
            "cancer": "p06",
            "classifier": "p06",
            "linkstash": "p07",
            "portfolio_v1": "p08",
            "portfolio-v1": "p08"
        }
        
        colors = ["cyan", "violet", "emerald", "amber", "rose", "fuchsia"]
        color_idx = 0
        
        for repo in repos:
            repo_name = repo["name"].lower()
            is_fork = repo.get("fork", False)
            if is_fork:
                continue
                
            # Check if this is a practice repository
            if any(k in repo_name for k in ["leetcode", "hackerrank", "practice", "problems", "interview"]):
                commits = fetch_commit_count(username, repo["name"], headers)
                if "leetcode" in repo_name:
                    practice_leetcode += commits
                elif "hackerrank" in repo_name:
                    practice_hackerrank += commits
                else:
                    practice_leetcode += commits // 2
                    practice_hackerrank += commits - (commits // 2)
                continue
                
            # Otherwise it's a standard project
            commits = fetch_commit_count(username, repo["name"], headers)
            
            pid = None
            for key, val in repo_mapping.items():
                if key in repo_name:
                    pid = val
                    break
                    
            if not pid:
                pid = f"g_{repo['id']}"
                
            project_stats[pid] = {
                "name": repo["name"].replace("-", " ").title(),
                "commits": commits,
                "stargazers": repo["stargazers_count"],
                "updated_at": repo["updated_at"],
                "color": colors[color_idx % len(colors)]
            }
            color_idx += 1
            
        # Ensure our core resume projects exist (fallback values if not found on GitHub)
        core_projects = {
            "p01": {"name": "Flow by Coridors", "commits": 145, "stargazers": 2, "updated_at": "2024-05-21T00:00:00Z", "color": "cyan"},
            "p02": {"name": "RAG Document Assistant", "commits": 42, "stargazers": 1, "updated_at": "2024-04-18T00:00:00Z", "color": "violet"},
            "p03": {"name": "Secure Ingestion Connector", "commits": 38, "stargazers": 0, "updated_at": "2024-03-12T00:00:00Z", "color": "emerald"},
            "p04": {"name": "CARL — Investment App", "commits": 88, "stargazers": 4, "updated_at": "2023-05-20T00:00:00Z", "color": "amber"},
            "p05": {"name": "Autonomous Drone Delivery", "commits": 64, "stargazers": 3, "updated_at": "2021-06-15T00:00:00Z", "color": "rose"},
            "p06": {"name": "Breast Cancer ML Classifier", "commits": 22, "stargazers": 1, "updated_at": "2021-09-30T00:00:00Z", "color": "fuchsia"},
            "p07": {"name": "LinkStash App", "commits": 50, "stargazers": 2, "updated_at": "2024-05-21T00:00:00Z", "color": "emerald"},
            "p08": {"name": "Portfolio v1", "commits": 120, "stargazers": 5, "updated_at": "2026-05-21T00:00:00Z", "color": "rose"}
        }
        
        for pid, base in core_projects.items():
            if pid not in project_stats:
                project_stats[pid] = base
            else:
                project_stats[pid]["commits"] = max(project_stats[pid]["commits"], base["commits"])
                project_stats[pid]["stargazers"] = max(project_stats[pid]["stargazers"], base["stargazers"])
                
        if practice_leetcode == 0:
            practice_leetcode = 145
        if practice_hackerrank == 0:
            practice_hackerrank = 80
            
        stats_data = {
            "projects": project_stats,
            "practice": {
                "leetcode_commits": practice_leetcode,
                "hackerrank_commits": practice_hackerrank,
                "total": practice_leetcode + practice_hackerrank
            },
            "cached_at": datetime.now(timezone.utc).isoformat()
        }
        return stats_data
        
    except Exception as e:
        logger.error(f"Error fetching GitHub stats: {e}")
        return None

# --- MongoDB Cache Handlers ---
async def get_globe_stats_from_db():
    try:
        cache = await get_db().globe_stats.find_one({}, {"_id": 0})
        return cache
    except Exception as e:
        logger.error(f"Error reading cache from DB: {e}")
        return None

async def save_globe_stats_to_db(stats_data):
    try:
        await get_db().globe_stats.delete_many({})
        await get_db().globe_stats.insert_one(stats_data)
        logger.info("Globe stats cache updated successfully in MongoDB")
    except Exception as e:
        logger.error(f"Error writing cache to DB: {e}")

def get_mock_globe_stats():
    return {
        "projects": {
            "p01": {"name": "Flow by Coridors", "commits": 145, "stargazers": 2, "updated_at": "2024-05-21T00:00:00Z", "color": "cyan"},
            "p02": {"name": "RAG Document Assistant", "commits": 42, "stargazers": 1, "updated_at": "2024-04-18T00:00:00Z", "color": "violet"},
            "p03": {"name": "Secure Ingestion Connector", "commits": 38, "stargazers": 0, "updated_at": "2024-03-12T00:00:00Z", "color": "emerald"},
            "p04": {"name": "CARL — Investment App", "commits": 88, "stargazers": 4, "updated_at": "2023-05-20T00:00:00Z", "color": "amber"},
            "p05": {"name": "Autonomous Drone Delivery", "commits": 64, "stargazers": 3, "updated_at": "2021-06-15T00:00:00Z", "color": "rose"},
            "p06": {"name": "Breast Cancer ML Classifier", "commits": 22, "stargazers": 1, "updated_at": "2021-09-30T00:00:00Z", "color": "fuchsia"},
            "p07": {"name": "LinkStash App", "commits": 50, "stargazers": 2, "updated_at": "2024-05-21T00:00:00Z", "color": "emerald"},
            "p08": {"name": "Portfolio v1", "commits": 120, "stargazers": 5, "updated_at": "2026-05-21T00:00:00Z", "color": "rose"}
        },
        "practice": {
            "leetcode_commits": 145,
            "hackerrank_commits": 80,
            "total": 225
        },
        "cached_at": datetime.now(timezone.utc).isoformat()
    }

async def update_cache_task():
    loop = asyncio.get_event_loop()
    stats_data = await loop.run_in_executor(None, fetch_github_stats_sync, "indnikhilthakur")
    if stats_data:
        await save_globe_stats_to_db(stats_data)

# --- FastAPI Setup ---
app = FastAPI()

api_router = APIRouter(prefix="/api")

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/globe-stats", response_model=GlobeStatsResponse)
async def get_globe_stats(background_tasks: BackgroundTasks):
    cache = await get_globe_stats_from_db()
    
    should_refresh = False
    if not cache:
        should_refresh = True
        cache = get_mock_globe_stats()
    else:
        try:
            cached_time = datetime.fromisoformat(cache["cached_at"])
            age = (datetime.now(timezone.utc) - cached_time).total_seconds()
            if age > 21600: # 6 hours
                should_refresh = True
        except Exception:
            should_refresh = True
            
    if should_refresh:
        logger.info("Globe stats cache expired or empty. Triggering background refresh...")
        background_tasks.add_task(update_cache_task)
        
    return cache

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await get_db().status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await get_db().status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)