#  Nikulin Vasily © 2021

import sqlalchemy
from flask_security import RoleMixin

from data.db_session import SqlAlchemyBase


class Role(SqlAlchemyBase, RoleMixin):
    __tablename__ = 'roles'

    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    name = sqlalchemy.Column(sqlalchemy.String, unique=True)
    description = sqlalchemy.Column(sqlalchemy.String)

    def __str__(self):
        return self.name


class RolesUsers(SqlAlchemyBase, RoleMixin):
    __tablename__ = 'roles_users'

    user_id = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey('users.id'),
                                primary_key=True)
    role_id = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey('roles.id'))