import express from 'express'
import { createRequestHandler } from '@react-router/express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	if (req.method === 'OPTIONS') {
		res.sendStatus(200)
	} else {
		next()
	}
})

app.use(
	'/api/confluence',
	createProxyMiddleware({
		target: 'https://serasiautoraya.atlassian.net',
		changeOrigin: true,
		pathRewrite: {
			'^/api/confluence': '/wiki/api/v2',
		},
		onProxyReq: (proxyReq) => {
			proxyReq.setHeader('Origin', 'https://serasiautoraya.atlassian.net')
			proxyReq.setHeader('Referer', 'https://serasiautoraya.atlassian.net/wiki')
		},
		onError: (err, _, res) => {
			console.error('Proxy error:', err)
			res.status(500).json({ error: 'Proxy error' })
		},
	})
)

app.use(express.static('build/client'))

const build = await import('./build/server/index.js')
app.all('*', createRequestHandler({ build }))

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})