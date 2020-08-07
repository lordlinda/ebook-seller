const express=require('express')
const bodyParser =require('body-parser')
const exphbs =require('express-handlebars')
const dotenv =require('dotenv')

if(process.NODE_ENV !== 'production'){
   dotenv.config()
}

const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)

//initialise our app
const app =express()
//handlebars middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')
//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//set static folders
app.use(express.static(`${__dirname}/public`))

//Index route
app.get('/',(req,res)=>{
	res.render('index')
})
//Index route
app.get('/success',(req,res)=>{
	res.render('success')
})

//charge route
app.post('/charge',(req,res)=>{
	const amount =2500;

	stripe.customers.create({
		email:req.body.stripeEmail,
		source:req.body.stripeToken
	})
	.then(customer=>stripe.charges.create({
		amount,
		description:'Web development Ebook',
		currency:'usd',
		customer:customer.id
	}))
	.then(charge=> res.render('success'))
})



//for deployment to heroku
//because heroku is gonna choose a port for us during production
const port =process.env.PORT || 5000

app.listen(port,console.log(`server started on ${port}`))