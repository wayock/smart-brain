const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
            console.log(user)
            res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
        // if (!found) {
        //     res.status(400).json('no such user');
        // }
}

module.exports = {
    handleProfileGet: handleProfileGet
}