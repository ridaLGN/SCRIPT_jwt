const express = require('express');
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

const users =[

    {
        name:"emsi",
        password: "1234"
    }
]

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpgIBAAKCAQEAwIVs4NafkX0Yxw+EIubpprPNzLKviQoyUJ/L1YlXpryqymZr
1qEOlq13KAy20qvEhCmYz1TNl5XqoSn7DaRDGtHPB1dmMr1vuiE2vleOF1363FRp
uNdWYvk9F7QXkL9LJbGJs9Q1n14fLckXC8yidpliujDjLyZUA5SxrejYUBeaIA69
iIw5gH8JdBy7ApjiXUpKwZQcLgkJZFWcLr0WF1tInHXkPIspimv/nGCpElP2cwSO
QSDFv35whp0NrxmvxGEY7s5Q+Ge/7oeAbsfaMoQSzjThhjOdYu5pYRTc3X7DXuic
OGrcFkAB1cp+B4Vs0XNkGqW/LoAeTa3xhku8GwIDAQABAoIBAQCj12knl7/I82uI
zT2o7ldelZrJYDBfMhxL3RJ9shq0PdAj3DJeQEbIGOxVWyyj8aaWy0fO+t7U6LL7
YVzU6TxqsK++EbVZ7ToOb4HFT4IPhN2fcP9gXXKZXH+PkqaTexkbBRKpxim0bUef
kYlZc1e4EyWgS0ass7PAMGVeGdEtps3rggN4W/1L/4IqQikcecpgBEDaX2ogxa9e
7RdFFbg1lpCV9LZ0oIyGLdi4lW/A0/fmtm0MvdqFkCoP38LiJBGj0FBUzGYwR+K/
/fSmRtd7ZkX78hUWUE6+dohfRcPM2y7ucb68/gUXU7e+GeEsSoZ7Hd3S9eTnPk8z
ht12gCbBAoGBAOulathVc5rglSiH7gYNQAg+rjzNcnpZY+BidRjES0hPdBad+z0E
twK7hypqearJGGhBhYM1zu3iWcGJy3i6zpkdVVqc9sZnYt4M3VSbLGRbvUZlDQ4G
kbvyjQ0R1ON5n+Q2rT7QeWW8nEMpWWWSb6O8aDoj+Hx79K327WgEpT4RAoGBANEm
bunhL7VrHcM+ugYkfa2K919I42GD77DwyCrWjT7tJs+sxaH9Ep2VaFliMnNY1KCD
aDRimRw1/hC+g/ZYJd/I5s2Gk8CYpbDxqX0rLT0BTIsYQLVJIk/S5KgsVo1EL6yY
kDM66+YeVW9xUy56qvlHQY9JnlgEYxwFrx5JvxtrAoGBAKIejAOJxp8nI3dfDULc
mtERTo5GShwio7QcCLOhWKnG//cPeWnhdIdMvRFRb6Mv9rrDWTeMLXE76MReKL5G
xxxQMgjFNIILXtmlwCAVIdVpyC5GF1Uu79R+aswzGGPnqTk45LfydZKo0FjkebyH
oobjeFGHrcz2+r80wuBtUcIBAoGBAI7u6RXE40nkbm6kS5UvEwSq1+uycFKQTBps
Mx+ziMvcXo3G0TmnLjWriaisRzY1GvqnU2uZhnGVJJBk4uJT025gaftDYW5Z48JN
JTt5am0qmhjk9jPuSxiqU8HqqyvX0Yzupn2cYuLdEB4dIG+/PWEmpVM7SI92UBUy
fT8Bvy0JAoGBAKV3IDP49I9GRJSClG+hKCw3nqgQ79mQqABg9H6m4M5hsN708Iy/
+f120qrZojzEmt2yhdIoo70iNbyuQJQ8XUXjkPahgcyhtTR05SdnNPLIMSR1Ih6D
FFuAsJBynsTqyYlUgqt/b22p3mk68v4qFtWqciTTtgowxeqMJacIFvrZ
-----END RSA PRIVATE KEY-----`

const publicKey=`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwIVs4NafkX0Yxw+EIubp
prPNzLKviQoyUJ/L1YlXpryqymZr1qEOlq13KAy20qvEhCmYz1TNl5XqoSn7DaRD
GtHPB1dmMr1vuiE2vleOF1363FRpuNdWYvk9F7QXkL9LJbGJs9Q1n14fLckXC8yi
dpliujDjLyZUA5SxrejYUBeaIA69iIw5gH8JdBy7ApjiXUpKwZQcLgkJZFWcLr0W
F1tInHXkPIspimv/nGCpElP2cwSOQSDFv35whp0NrxmvxGEY7s5Q+Ge/7oeAbsfa
MoQSzjThhjOdYu5pYRTc3X7DXuicOGrcFkAB1cp+B4Vs0XNkGqW/LoAeTa3xhku8
GwIDAQAB
-----END PUBLIC KEY-----`



app.use(express.json())                                  //md

function jwtGuard(req,res,next){
    const idToken = req.headers.authorization  ;                                  //  authorization
    jwt.verify(idToken,publicKey,(err,decoded)=>{                               //vr clee
       if(err){
           res.status(401).send('Unauthorized')
       }else {
              req.userToken=decoded;               //pass le resulta token decodee a ma function
          next();
       }
    })
}

app.get('/',jwtGuard ,(req,res) => {
res.send(req.userToken)

   
})

app.post('/auth',(req, res) => {  // nv chemin d'acces client 

    const {name,password} = req.body

    const valid = users.some((user)=>user.name === name && user.password === password) //tst

    const token =jwt.sign({name}, privateKey,{algorithm: 'RS256' })

    if (valid) {
        res.send(token)
    } else {
        res.status(404).send("pas trouve")

    }
   
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})