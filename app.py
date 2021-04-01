from flask import Flask, render_template, redirect
from flask_login import logout_user, login_required, LoginManager, login_user, current_user

from data import db_session
from data.users import User
from forms.login import LoginForm
from forms.register import RegisterForm

app = Flask(__name__)
app.config['SECRET_KEY'] = 'yandexlyceum_secret_key'
login_manager = LoginManager()
login_manager.init_app(app)


def main():
    db_session.global_init('db/database.sqlite')
    app.run(debug=True)


@app.route('/')
@app.route('/index')
@app.route('/main')
def index():
    if current_user.is_authenticated:
        return redirect('/homework')
    return redirect('/login')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user: User
        user = db_sess.query(User).filter(User.email == form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            return redirect("/homework")
        return render_template('login.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        if form.password.data != form.password_again.data:
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Пароли не совпадают")
        db_sess = db_session.create_session()
        if db_sess.query(User).filter(User.email == form.email.data).first():
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Такой пользователь уже есть")
        user = User(
            surname=form.surname.data,
            name=form.name.data,
            last_name=form.last_name.data,
            date_of_birth=form.date_of_birth.data,
            email=form.email.data,
        )
        user.set_password(form.password.data)
        db_sess.add(user)
        db_sess.commit()
        login_user(user)
        return redirect('/login')
    return render_template('register.html', title='Регистрация', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/login")


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    return db_sess.query(User).get(user_id)


@login_required
@app.route('/homework')
def homework_page():
    if not current_user.is_authenticated:
        return redirect('/login')
    subjects = [
        ['Информатика', 'Физика', 'Геометрия', 'ОБЖ'],
        ['Английский язык', 'Физика', 'Литература'],
        ['Информатика', 'Алгебра', 'Литература'],
        ['Биология', 'Алгебра', 'Химия'],
        ['Физика', 'История', 'ОБЖ'],
        ['Физика', 'Английский язык', 'Английский язык'],
    ]
    homework = [
        ['дз по информатике', 'работа над ошибками'],
        [],
        [],
        [],
        [],
        []
                ]
    days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    time_start = ['9:00', '9:55', '10:50', '11:55', '13:00', '13:55', '14:50', '15:45']
    time_end = ['9:45', '10:40', '11:35', '12:40', '13:45', '14:40', '15:35', '16:30']
    return render_template('homework.html', title='Дневник', subjects=subjects,
                           homework=homework, days=days,
                           time_start=time_start, time_end=time_end)


if __name__ == '__main__':
    main()
