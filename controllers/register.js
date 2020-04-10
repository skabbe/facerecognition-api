

const handleRegister = (req, res, bcrypt, db) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission.')
    }
    const hash = bcrypt.hashSync(password);

    // bcrypt.compareSync("bacon", hash); // true
    // bcrypt.compareSync("veggies", hash); // false
    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then( loginEmail => {
            return trx('users')
                    .insert({
                        name:name,
                        email:loginEmail[0],
                        entries:0,
                        joined: new Date()
                    })
                    .returning('*')
                    .then(user => {
                        res.json(user[0])
                    })
        })
        .then(trx.commit)
        .catch(trx.rollback)

    })
    .catch(err => res.status(400).json('Unable to register'))

}


export default handleRegister
