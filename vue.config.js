const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const qiniu = require("qiniu")
         
module.exports = {
    devServer:{

        proxy: {
            '/server': {
                target: 'http://140.143.3.32:5000/',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,    //這裡true表示实现跨域
                pathRewrite: {
                    '^/server': '/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            }
        },

        before(app,serve){
            app.use(cors());
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({extended:false}));

            app.post('/api/uploadkey', (req, res) => {
                let mac = new qiniu.auth.digest.Mac('Fugm-p3szClQNl_dCczZje4CeQ7MpcE0W-WczSaE', 'zOLD9xW17NBuRsGsTUwwhPOdYLiblwBS7Vpw3jFo');
                let options = {
                    scope: 'xmall-commodity',
                };
                let putPolicy = new qiniu.rs.PutPolicy(options);
                let uploadToken = putPolicy.uploadToken(mac);
                res.json({
                    uploadkey: uploadToken
                })
            })
            
        }
    }   
}