/*
 * Nikulin Vasily © 2021
 */

let users = Object()

users.get = function (fn = null) {
    if (fn)
        users.getFn = fn
    else
        users.getFn = null
    socket.emit('getUsers')
}

socket.on('getUsers', function (data) {
    users.getJson = data
    if (users.getFn)
        users.getFn(data)
})

// TODO: fix json
users.post = function (email = null,
                       password = null,
                       surname = null,
                       name = null,
                       patronymic=null,
                       date_of_birth=null,
                       epos_login=null,
                       epos_password=null,
                       school_id=null,
                       about=null,
                       fn = null) {
    if (fn)
        users.postFn = fn
    else
        users.postFn = null
    socket.emit('createUser', {
        'email': email,
        'password': password,
        'surname': surname,
        'name': name,
        'patronymic': patronymic,
        'date_of_birth': date_of_birth,
        'epos_login': epos_login,
        'epos_password': epos_password,
        'school_id': school_id,
        'about': about
    })
}

socket.on('createUser', function (data) {
    users.postJson = data
    if (users.postFn)
        users.postFn(data)
})


users.put = function (sessionId = null,
                      fn = null) {
    if (fn)
        users.putFn = fn
    else
        users.putFn = null
    socket.emit('editUser', {
        'sessionId': sessionId
    })
}

socket.on('editUser', function (data) {
    users.putJson = data
    if (users.putFn)
        users.putFn(data)
})


users.delete = function (identifier = null,
                         fn = null) {
    if (fn)
        users.deleteFn = fn
    else
        users.deleteFn = null
    socket.emit('deleteUser', {
        'identifier': identifier
    })
}

socket.on('deleteUser', function (data) {
    users.deleteJson = data
    if (users.deleteFn)
        users.deleteFn(data)
})