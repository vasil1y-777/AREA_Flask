from .db_session import SqlAlchemyBase
import sqlalchemy


class Project(SqlAlchemyBase):
    __tablename__ = '8_class_projects'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String)
    section = sqlalchemy.Column(sqlalchemy.String)
    authors_ids = sqlalchemy.Column(sqlalchemy.String)
