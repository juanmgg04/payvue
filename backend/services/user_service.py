from models import User, db

def update_email(user_id, new_email):
    user = User.query.get(user_id)
    if not user:
        return None
    user.email = new_email
    db.session.commit()
    return user