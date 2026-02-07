from __future__ import annotations

from fastapi import APIRouter

from app.modules.auth.router import router as auth_router
from app.modules.borrowers.router import router as borrower_router
from app.modules.commissions.router import router as commission_router
from app.modules.deals.router import router as deals_router
from app.modules.exports.router import router as exports_router
from app.modules.lenders.router import router as lenders_router
from app.modules.partners.router import router as partners_router
from app.modules.pipeline.router import router as pipeline_router
from app.modules.resources.router import router as resources_router
from app.modules.substages.router import router as substages_router

router = APIRouter()
router.include_router(auth_router, tags=["auth"])
router.include_router(partners_router, tags=["partners"])
router.include_router(borrower_router, tags=["borrowers"])
router.include_router(deals_router, tags=["deals"])
router.include_router(pipeline_router, tags=["pipeline"])
router.include_router(substages_router, tags=["substages"])
router.include_router(lenders_router, tags=["lenders"])
router.include_router(commission_router, tags=["commissions"])
router.include_router(resources_router, tags=["resources"])
router.include_router(exports_router, tags=["exports"])
