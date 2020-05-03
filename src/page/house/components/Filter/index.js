import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import {getCurrCity} from "../../../../utils";
import {getFilters} from "../../../../utils/api/house";
// 过滤器title高亮状态
const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false
}
// 当前选中的picker值的默认数据
const selectedValues = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: []
}
export default class Filter extends Component {
    // 定义状态数据
    state = {
        // 高亮数据
        titleSelectedStatus,
        // 是否显示picker
        openType: ''
    }
    componentDidMount() {
        this.getFilterData();
        // 当前选中的值
        this.selectedValues = {...selectedValues};
    }

    // 获取筛选条件的数据
    getFilterData = async () => {
        // 当前城市的id
        let {value} = await getCurrCity();
        let {status, data} = await getFilters(value);
        if (status === 200) {
            // 存储到this上
            this.filerDatas = data;

        }
    }
    // 提供修改数据高亮数据方法
    onTitleClick = (type) => {
        let newSelected = {...titleSelectedStatus, [type]:true};
        this.setState({
            titleSelectedStatus: newSelected,
            openType: type
        })
    }
    // 是否显示前三个过滤器的内容
    isShowPicker = () => {
        const {openType} = this.state;
        return openType === 'area' || openType === 'mode' || openType === 'price'
    }
    // 处理确定的时候，高亮对应的title
    handleSel = () => {
        // 存储新的高亮状态
        const newStatus = {...titleSelectedStatus};
        // 遍历存储中的选中数据，确定是否高亮
        Object.keys(this.selectedValues).forEach((key) => {
            // 获取当前picker选中的值
            let cur = this.selectedValues[key];
            // 判断是否高亮
            if (key === 'area' && (cur[1] !== 'null' || cur[0] === 'subway')) {
                newStatus[key] = true;
            } else if (key === 'mode' && cur[0] !== 'null') {
                newStatus[key] = true;
            } else if (key === 'more' && cur.length > 0) {
                newStatus[key] = true;
            } else if (key === 'price' && cur[0] !== 'null') {
                newStatus[key] = false;
            } else {
                newStatus[key] = false;
            }
        })
        return newStatus;
    }
    // 处理所有筛选数据
    formatFilter = (selDatas) => {
        // 获取存储的筛选条件数据
        const {area,mode,price,more} = selDatas;
        // 组装数据
        const filters = {};
        let areaKey = area[0],aval;
        if (area.length === 2) {
            aval = area[1]
        } else {
            if (area[2] === 'null') {
                aval = area[1]
            } else {
                aval = area[2]
            }
        }
        filters[areaKey] = aval;
        // 出租方式 价格
        filters.rentType = mode[0]
        filters.price = price[0]
        filters.more = more.join(',')
        return filters;
    }
    // 点击确定
    onOk = (curSel) => {
        // 存储到组件this
        const {openType} = this.state;
        this.selectedValues[openType] = curSel;
        this.handleSel()
        this.setState({
            openType: '',
            titleSelectedStatus: this.handleSel()
        }, () => {
            // 传递用户选择的过滤器数据
            this.props.onFilter(this.formatFilter(this.selectedValues)
            )
        })
    }
    // 点击取消
    onCance = () => {
        this.setState({
            openType: '',
            titleSelectedStatus: this.handleSel()
        })
    }
    // 渲染picker对应的数据
    renderPicker = () => {
        if (this.isShowPicker()) {
            // 获取对应picker数据
            const {area,subway,rentType,price} = this.filerDatas;
            const {openType} = this.state;
            // 传递对应的picker数据
            let data,cols = 1;
            // 当前选中的值
            let curSel = this.selectedValues[openType];
            // 根据opentype去取当点击的picker数据
            switch (openType) {
                case "area":
                    data = [area,subway];
                    cols = 3
                    break;
                case "mode":
                    data = rentType
                    break;
                case "price":
                    data = price
                    break;
            }
            return <FilterPicker data={data} key={openType} value={curSel} cols={cols} onOk={this.onOk} onCance={this.onCance} />
        }
    }
    // 渲染第四个
    renderFilterMore = () => {
        const {openType} = this.state;
        if (openType === 'more') {
            // 传递过滤条件数据
            const {oriented, floor, roomType, characteristic} = this.filerDatas;
            let data = {oriented, floor, roomType, characteristic};
            return (
                <FilterMore value={this.selectedValues[openType]} data={data} onOk={this.onOk} onCance={this.onCance}/>
            )
        }
    }
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
          {
              this.isShowPicker() ? <div onClick={this.onCance} className={styles.mask} /> :null
          }
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onTitleClick={this.onTitleClick} titleSelectedStatus={this.state.titleSelectedStatus} />

          {/* 前三个菜单对应的内容： */}
            {
               this.renderPicker()
            }

          {/* 最后一个菜单对应的内容： */}
            {
                this.renderFilterMore()
            }
        </div>
      </div>
    )
  }
}
