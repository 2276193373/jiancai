export default {
    async apiCalls(endpointer, method, header, data) {
        let baseUrl = 'https://ceramic.lindingtechnology.com/' + endpointer;
        if (header === 'defaultHeader') {
            header =  {
                "content-type": "application/json",
                "Authorization": "Bearer " + wx.getStorageSync('token')
            };
        } else if (header === 'header') {
            header =  {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + wx.getStorageSync('token')
            }
        } else if (header === 'headerNoType') {
            header = {
                "Authorization": "Bearer " + wx.getStorageSync('token')
            }
        }
        if (!data) {
            data = {}
        }
        let res = await new Promise(((resolve, reject) => {
            wx.request({
                url: baseUrl,
                method: method,
                header: header,
                data: data,
                success: function (res) {
                    resolve(res);
                },
                fail: function (res) {
                    reject(res)
                }
            });
        }))
        return res;
    },
    //重新登录
    async relogin() {
        let _relogin = await this.apiCalls('weapp/users/relogin', 'POST', 'header');
        return _relogin;
    },
    //获取用户信息
    async getUserInfo() {
        return await this.apiCalls('weapp/users/me', 'GET', 'headerNoType')
    },
    //发布信息
    async publish(title, desc, atlas, type, address) {
        return await this.apiCalls('weapp/infos', 'POST', 'headerNoType', {
            title: title,
            desc: desc,
            atlas: atlas,
            type: type,
            address: address
        })
    },
    //上传七牛云
    async uploadQiniu() {
        return await this.apiCalls('common/qiniu/uptoken', 'GET', 'defaultHeader')
    },
    //获取信息列表
    async getInfoList(type, sortKind, longitude, latitude, perPage, page) {
        return await this.apiCalls(`weapp/infos?type=${type}&sort=${sortKind}&longtitude=${longitude}&latitude=${latitude}&perPage=${perPage}&page=${page}`, 'GET', 'defaultHeader')
    },
    //获取用户信息流列表
    async getUserInfoList(type) {
        return await this.apiCalls(`weapp/users/me/infos?type=${type}`, 'GET', 'headerNoType')
    },
    //获取信息详情
    async getDetail(_id, longitude, latitude) {
        return this.apiCalls(`weapp/infos/${_id}?longitude=${longitude}&latitude=${latitude}`, 'GET', 'defaultHeader')
    },
    //浏览记录
    async browseringHistory(_id, infoId) {
        return await this.apiCalls(`weapp/infos/${_id}/interest`, 'POST', 'headerNoType', {
            infoId: infoId
        })
    },
    //获取浏览记录列表
    async getBrowseringHistory(_id) {
        return await this.apiCalls(`weapp/infos/${_id}/interest`, 'GET', 'headerNoType')
    },
    //完善用户信息
    async improvement(realName, company, position, avatarUrl, gender) {
        return await this.apiCalls('weapp/users/me', 'PUT', 'header', {
            realName: realName,
            company: company,
            position: position,
            avatarUrl: avatarUrl,
            gender: gender
        })
    },
    //绑定手机号
    async bindPhoneNumber(iv, encryptedData) {
        return await this.apiCalls('weapp/users/me/bind/phone', 'PUT', {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
        }, {
            iv: iv,
            encryptedData: encryptedData
        })
    },
    //登录
    async login(code, iv='', encryptedData='') {
        return await this.apiCalls('weapp/users/login', 'POST', 'header', {
            code: code,
            iv: iv, //通过getUserInfo拿到,下同
            encryptedData: encryptedData
        })
    },
    //修改公司
    async modifycompany(company) {
        this.getUserInfo().then((res) => {
            return this.apiCalls('weapp/users/me', 'PUT', 'header', {
                company: company,
                realName: res.data.data.realName,
                position: res.data.data.position,
                gender: res.data.data.gender,
                avatarUrl: res.data.data.avatarUrl
            }).then((res) => {
                this.relogin().then((res) => {
                    let token = res.data.data.token;
                    wx.setStorageSync('token', token);
                    console.log('relogin提示：更新信息成功！')
                });
            });
        });
    },
    //修改名字
    async modifyRealName(realName) {
        this.getUserInfo().then((res) => {
            return this.apiCalls('weapp/users/me', 'PUT', 'header', {
                realName: realName,
                company: res.data.data.company,
                position: res.data.data.position,
                gender: res.data.data.gender,
                avatarUrl: res.data.data.avatarUrl
            }).then((res) => {
                console.log('修改名字后返回的信息：',res.data)
                this.relogin().then((res) => {
                    let token = res.data.data.token;
                    wx.setStorageSync('token', token);
                    console.log('relogin提示：更新信息成功！')
                });
            });
        });
    },
    //修改职位
    async modifyPosition(position) {
        this.getUserInfo().then((res) => {
            return this.apiCalls('weapp/users/me', 'PUT', 'header', {
                position: position,
                realName: res.data.data.realName,
                company: res.data.data.company,
                gender: res.data.data.gender,
                avatarUrl: res.data.data.avatarUrl
            }).then((res) => {
                this.relogin().then((res) => {
                    let token = res.data.data.token;
                    wx.setStorageSync('token', token);
                    console.log('relogin提示：更新信息成功！')
                });
            });
        });
    },
    //修改性别
    async modifyGender(gender) {
        this.getUserInfo().then((res) => {
            return this.apiCalls('weapp/users/me', 'PUT', 'header', {
                gender: gender,
                position: res.data.data.position,
                realName: res.data.data.realName,
                company: res.data.data.company,
                avatarUrl: res.data.data.avatarUrl
            }).then((res) => {
                this.relogin().then((res) => {
                    let token = res.data.data.token;
                    wx.setStorageSync('token', token);
                    console.log('relogin提示：更新信息成功！')
                });
            });
        });
    },
    //修改头像
    async modifyAvatarUrl(avatarUrl) {
        this.getUserInfo().then((res) => {
            return this.apiCalls('weapp/users/me', 'PUT', 'header', {
                avatarUrl: avatarUrl,
                gender: res.data.data.gender,
                position: res.data.data.position,
                realName: res.data.data.realName,
                company: res.data.data.company,
            }).then((res) => {
                this.relogin().then((res) => {
                    let token = res.data.data.token;
                    wx.setStorageSync('token', token);
                    console.log('relogin提示：更新信息成功！')
                });
            });
        });
    }
}
