"""
Vercel serverless entry: Mangum (ASGI) → FastAPI app z koreňového main.py.
"""

import sys
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from mangum import Mangum

from main import app

handler = Mangum(app, lifespan="off")
