import React, { Component } from 'react'
import { getCityList, getHotCity } from "../../utils/api/city";
import {getCurrCity,CURR_CITY,setLocalData} from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import {NavBar, Icon, Toast} from "antd-mobile";
import './index.scss'

class CityList extends Component {
    // 状态数据
    state = {
        // 城市索引
        cityIndex: [],
        // 城市数据
        cityList: {},
        // 当前滚动行索引
        activeIndex: 0
    }
    componentDidMount() {
        this.getCityList();
    }
    // 格式化列表
    formatLetter = (letter,isRight) => {
        switch (letter) {
            case 'hot':
                return isRight?'热':'热门城市';
            case '#':
                return isRight?'当':'当前城市';
            default:
                return letter.toUpperCase();
        }
    }
    // 切换城市
    changeCity = (item) => {
        // 判断数据
        const hasData = ['北京','上海','广州','深圳'];
        if (hasData.includes(item.label)) {
            // 更新当前城市数据
            setLocalData(CURR_CITY, JSON.stringify(item));
            // 跳转到首页
            this.props.history.push('/')
        } else {
            Toast.info('该城市暂无房源信息！')
        }

    }
    rowRenderer = ({
        key,
        index,
        isScrolling,
        isVisible,
        style,
    }) => {
        // 获取状态数据
        const  { cityList, cityIndex } = this.state;
        // 对象的键
        let letter = cityIndex[index];
        // 对象的值
        let item = cityList[letter];
        return (
            <div key={key} style={style} className="city-item">
                <div className="title">{this.formatLetter(letter)}</div>
                <div className="name">{
                    item.map((item) => <div onClick={() => this.changeCity(item)} key={item.value} className="name">{item.label}</div>)
                }</div>
            </div>
        )
    }
    // 获取城市列表数据
    getCityList = async () => {
        const {status, data} = await getCityList();
        if (status === 200) {
            // 归类数据
            let { cityList,cityIndex } = this.formatCities(data);
           // 热门城市数据
            const { status: st, data: hot} = await getHotCity();
            if (st === 200) {
                cityList['hot'] = hot;
                cityIndex.unshift('hot')
            }
            // 加入当前城市
            const res = await getCurrCity();
            cityList['#'] = [res];
            cityIndex.unshift('#');
            // 响应式
            this.setState({
                cityList,
                cityIndex
            })
        }
    }
    // 按城市首字母归类城市数据
    formatCities = (data) => {
        // 归类的数据
        let cityList = {}, cityIndex;
        // 遍历数据归类
        data.forEach((item) => {
            // 获取当前的城市首字母
            let first = item.short.slice(0,1);
            // 排重归类
            if (!cityList[first]) {
                cityList[first] = [item];
            } else {
                cityList[first].push(item);
            }
        })
        console.log(cityList)
        // 获取归类的首字母数据
        cityIndex = Object.keys(cityList).sort();
        return {
            cityList,
            cityIndex
        }
    }
    // 动态计算高度
    excueHeight = ({index}) => {
        const {cityIndex,cityList} = this.state;
        // 当前归类的城市数量
        let curKey = cityIndex[index];
        return 36 + cityList[curKey].length * 50;
    }
    // 渲染右侧索引
    renderCityIndex = () => {
        const {cityIndex,activeIndex} = this.state;
        return cityIndex.map((item, index) => {
            return (
                <li
                    key={item}
                    className="city-index-item"
                    onClick={() => {
                        // 点击定位列表
                        this.listRef.scrollToRow(index);
                    }}
                >
          <span className={activeIndex === index ? 'index-active' : ''}>
            {this.formatLetter(item, true)}
          </span>
                </li>

            )
        })
    }
    // 渲染完执行
    onRowsRendered = ({startIndex}) => {
        // startIndex当前滚动行的索引
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }
    render() {
        return (
            <div className="cityList">
                {/* 导航返回 */}
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    城市选择
                </NavBar>
                {/*城市列表*/}
                <AutoSizer>
                    {({height,width}) => (
                            <List
                                ref={(ele) => this.listRef = ele}
                                scrollToAlignment='start'
                                onRowsRendered={this.onRowsRendered}
                                height={height}
                                width={width}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.excueHeight}
                                rowRenderer={this.rowRenderer}
                            />
                        )}
                </AutoSizer>
                {/* 右侧索引列表 */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}
export default CityList;
