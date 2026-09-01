import os
from slowapi import Limiter
from slowapi.util import get_remote_address

RATE_ANALYZE = os.getenv("RATE_ANALYZE", "60/minute")
RATE_FEATURES_HVY = os.getenv("RATE_FEATURES_HVY", "60/minute")
RATE_FEATURES_LGT = os.getenv("RATE_FEATURES_LGT", "60/minute")
RATE_AUTH = os.getenv("RATE_AUTH", "60/minute")

limiter = Limiter(key_func=get_remote_address)
