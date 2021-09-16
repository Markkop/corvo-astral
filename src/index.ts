import 'module-alias/register'
import initiateBot from './bot';
import initiateServer from './server'
require('dotenv').config()

initiateBot()
initiateServer()