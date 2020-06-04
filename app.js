const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')
const morgan = require('morgan');
const AccessControl = require('accesscontrol');


const app = express();
app.use(express.json())
app.use(morgan('dev'))

const id = uuid.v4();

const employers = [
    {
        id: "06873fa6-e5fe-42cd-bc9b-f266cc0c0080",
        name: "majemu",
        role: "user",

    },
    {
        id: "3009ad79-f456-445e-8ca1-791e95c6ed9e",
        name: "Seyi Osifeso",
        role: "admin",

    },
    {
        id: "dc833932-3eff-4197-8718-6c9228adf5e9",
        name: "Wande",
        role: "superAdmin",

    },

]
// Declaration of role
let grantsObject = {
    admin: {
        employee: {
            'create:any': ['*', '!name'],
            'read:any': ['*', '!name'],
            'update:any': ['*', '!views'],
            'delete:any': ['*']
        }
    },
    user: {
        employee: {
            'create:own': ['*', '!rating', '!views'],
            'read:own': ['*'],
            'update:own': ['*', '!rating', '!views'],
            'delete:own': ['*']
        }
    }
};
const middleware = (req, res, next) => {
    req.role = req.headers.usertype
    next();
    
};


app.get('/employers', middleware, (req, res) => {

    const ac = new AccessControl();
    ac.setGrants(grantsObject);
    const permission = ac.can(req.role).createAny('employee');
    console.log(permission.attributes);
    
    if (permission.granted) {
       return res.json({
            status: "success",
            data: permission.filter(employers) 
        })
    }
    return res.json({
        status: "error",
        message: "You're not authorized to perform this task"
    });
    
});

app.post('/employers', middleware, (req, res) => {
    const ac = new AccessControl();
    ac.setGrants(grantsObject);

    const permission = ac.can(req.role).createAny('employee');
    console.log(permission.attributes);


    if (permission.granted) {
        const newEmployer = {id, ...req.body}
       return  res.json({
            status: "success",
            data:newEmployer
        });
    }

    return res.json({
        status: "error",
        message: "You're not authorized to perform this task"
    });
    

    
});

app.listen(2000, () => console.log('app running on port 2000'));

