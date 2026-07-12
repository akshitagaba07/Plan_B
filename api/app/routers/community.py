from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import User, Profile, Community, CommunityMember, CommunityPost, CommunityComment
from ..schemas import CommunityCreate, CommunityResponse, CommunityPostCreate, CommunityPostResponse, CommunityCommentCreate, CommunityCommentResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/communities", tags=["Communities"])

@router.get("", response_model=List[CommunityResponse])
def get_communities(
    current_user_id: Optional[int] = None, # Optional if not logged in
    db: Session = Depends(get_db)
):
    comms = db.query(Community).all()
    res = []
    for c in comms:
        member_count = db.query(CommunityMember).filter(CommunityMember.community_id == c.id).count()
        is_joined = False
        if current_user_id:
            joined = db.query(CommunityMember).filter(
                CommunityMember.community_id == c.id,
                CommunityMember.user_id == current_user_id
            ).first()
            is_joined = joined is not None
            
        res.append({
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "cover_image": c.cover_image,
            "category": c.category,
            "creator_id": c.creator_id,
            "created_at": c.created_at,
            "member_count": member_count,
            "is_joined": is_joined
        })
    return res

@router.post("", response_model=CommunityResponse)
def create_community(
    comm_in: CommunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Community).filter(Community.name == comm_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Community name already exists")
        
    new_c = Community(
        name=comm_in.name,
        description=comm_in.description,
        cover_image=comm_in.cover_image or f"https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=60",
        category=comm_in.category,
        creator_id=current_user.id
    )
    db.add(new_c)
    db.commit()
    db.refresh(new_c)
    
    # Creator automatically becomes a member
    mem = CommunityMember(community_id=new_c.id, user_id=current_user.id)
    db.add(mem)
    db.commit()
    
    return {
        "id": new_c.id,
        "name": new_c.name,
        "description": new_c.description,
        "cover_image": new_c.cover_image,
        "category": new_c.category,
        "creator_id": new_c.creator_id,
        "created_at": new_c.created_at,
        "member_count": 1,
        "is_joined": True
    }

@router.post("/{community_id}/join")
def join_community(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comm = db.query(Community).filter(Community.id == community_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Community not found")
        
    joined_entry = db.query(CommunityMember).filter(
        CommunityMember.community_id == community_id,
        CommunityMember.user_id == current_user.id
    ).first()
    
    if joined_entry:
        # Leave if joined
        db.delete(joined_entry)
        db.commit()
        return {"message": "You left the community successfully", "joined": False}
        
    # Join
    new_mem = CommunityMember(community_id=community_id, user_id=current_user.id)
    db.add(new_mem)
    db.commit()
    return {"message": "You joined the community successfully", "joined": True}

@router.get("/{community_id}/posts", response_model=List[CommunityPostResponse])
def get_community_posts(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    posts = db.query(CommunityPost).filter(CommunityPost.community_id == community_id).order_by(CommunityPost.created_at.desc()).all()
    res = []
    for p in posts:
        author_prof = db.query(Profile).filter(Profile.user_id == p.author_id).first()
        likes_list = p.likes
        
        comments_db = db.query(CommunityComment).filter(CommunityComment.post_id == p.id).order_by(CommunityComment.created_at.asc()).all()
        comments = []
        for c in comments_db:
            c_author_prof = db.query(Profile).filter(Profile.user_id == c.author_id).first()
            comments.append({
                "id": c.id,
                "post_id": c.post_id,
                "author_id": c.author_id,
                "author_name": c_author_prof.name if c_author_prof else "Anonymous",
                "author_pic": c_author_prof.profile_pic if c_author_prof else None,
                "content": c.content,
                "created_at": c.created_at
            })
            
        res.append({
            "id": p.id,
            "community_id": p.community_id,
            "author_id": p.author_id,
            "author_name": author_prof.name if author_prof else "Anonymous",
            "author_pic": author_prof.profile_pic if author_prof else None,
            "title": p.title,
            "content": p.content,
            "likes_count": len(likes_list),
            "is_liked": current_user.id in likes_list,
            "comments": comments,
            "created_at": p.created_at
        })
    return res

@router.post("/{community_id}/posts", response_model=CommunityPostResponse)
def create_community_post(
    community_id: int,
    post_in: CommunityPostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comm = db.query(Community).filter(Community.id == community_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Community not found")
        
    new_post = CommunityPost(
        community_id=community_id,
        author_id=current_user.id,
        title=post_in.title,
        content=post_in.content,
        likes_json="[]"
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    author_prof = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    
    return {
        "id": new_post.id,
        "community_id": new_post.community_id,
        "author_id": new_post.author_id,
        "author_name": author_prof.name if author_prof else "Anonymous",
        "author_pic": author_prof.profile_pic if author_prof else None,
        "title": new_post.title,
        "content": new_post.content,
        "likes_count": 0,
        "is_liked": False,
        "comments": [],
        "created_at": new_post.created_at
    }

@router.post("/posts/{post_id}/like")
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    likes_list = post.likes
    if current_user.id in likes_list:
        likes_list.remove(current_user.id)
        is_liked = False
    else:
        likes_list.append(current_user.id)
        is_liked = True
        
    post.likes = likes_list
    db.commit()
    return {"likes_count": len(likes_list), "is_liked": is_liked}

@router.post("/posts/{post_id}/comments", response_model=CommunityCommentResponse)
def comment_on_post(
    post_id: int,
    comment_in: CommunityCommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    new_comment = CommunityComment(
        post_id=post_id,
        author_id=current_user.id,
        content=comment_in.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    author_prof = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    
    return {
        "id": new_comment.id,
        "post_id": new_comment.post_id,
        "author_id": new_comment.author_id,
        "author_name": author_prof.name if author_prof else "Anonymous",
        "author_pic": author_prof.profile_pic if author_prof else None,
        "content": new_comment.content,
        "created_at": new_comment.created_at
    }
