// components/NavBar/NavBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        values: [
            {value: "只看供应"},
            {value: "只看需求"}
        ],
        //被点击的导航菜单的索引
        currentIndex: 0
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //点击首页导航栏按钮
        activeNav(e) {
            console.log(e.target);
            this.setData({
                currentIndex: e.target.dataset.index
            });
        }
    }
})
