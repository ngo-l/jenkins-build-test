from fastapi import APIRouter, Response, status

router = APIRouter(prefix="/healthz")


@router.get("/", status_code=status.HTTP_204_NO_CONTENT)
async def health_check():
    return Response(status_code=status.HTTP_204_NO_CONTENT)
