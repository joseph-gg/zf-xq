import React from 'react'

import {Flex, Toast} from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import {getHouseListBy} from "../../utils/api/house";
import {getCurrCity} from "../../utils";
import {List, AutoSizer, InfiniteLoader} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import {BASE_URL} from "../../utils/axios";
import NoHouse from "../../components/NoHouse";
export default class HouseList extends React.Component {
    state = {
        // 房屋列表数据
        list: [],
        // 列表数据总条数
        count: 0
    }
    // 判断列表中的每一行是否加载完成
    isRowLoaded = ({index}) => {
        // console.log('rowloaded:', index);
        const {list} = this.state;
        return !!list[index];
    }

    // 下拉加载更多时触发：加载下一页数据
    loadMoreRows = ({startIndex, stopIndex}) => {
        console.log('loadmore', startIndex, stopIndex);
        // 调用封装的api(返回一个Promise对象)
        return getHouseListBy(this.cityId, this.filters, startIndex, stopIndex).then((res) => {
            console.log('loadmore:', res);
            // 刷新视图
            this.setState({
                list: [...this.state.list, ...res.data.list]
            }, () => console.log(this.state.list.length))
        });
    }
    // 渲染列表项方法
    renderHouseItem = ({
                           key, // Unique key within array of rows
                           index, // Index of row within collection
                           isScrolling, // The List is currently being scrolled
                           isVisible, // This row is visible within the List (eg it is not an overscanned row)
                           style, // Style object to be applied to row (to position it)
                       }) => {
        // 获取数据
        const {list} = this.state;
        // 获取当前列表的数据
        const item = list[index];
        // 处理暂时没有加载到数据情况
        if (!item) {
            return (
                <div style={style} key={key}>
                    <p className={styles.loading}></p>
                </div>
            )
        }
        // 处理图片地址和键值
        item.src = `${BASE_URL}${item.houseImg}`
        return (
            <HouseItem {...item} key={key} onClick={() => {
                this.props.history.push('/detail/'+ item.houseCode)
            }} style={style} className=""/>
        );
    }

    async componentDidMount() {
        let {value} = await getCurrCity();
        this.cityId = value;
        this.getHouseList();
    }

    onFilter = (filters) => {
        // 过滤条件数据存储this
        this.filters = filters;
        // 获取列表数据
        this.getHouseList()
    }
    // 获取列表数据
    getHouseList = async () => {
        let {status, data: {list, count}} = await getHouseListBy(this.cityId, this.filters, 1, 20);
        if (status === 200) {
            // 有数据提示
            if (count !== 0) {
                Toast.success(`获取到${count}条房源数据！`)
            }
            this.setState({
                list,
                count
            })
        }
    }
// 渲染列表
    renderList = () =>  {
        const {count} = this.state;
        return count === 0 ? <NoHouse>没有更多房源,请换个搜索条件吧</NoHouse> : (<InfiniteLoader
            loadMoreRows={this.loadMoreRows}
            isRowLoaded={this.isRowLoaded}
            rowCount={this.state.count}
        >
            {({ onRowsRendered, registerChild }) => (
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            className={styles.houseList}
                            height={height}
                            rowCount={this.state.count}
                            rowHeight={130}
                            rowRenderer={this.renderHouseItem}
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                            width={width}
                        />
                    )}
                </AutoSizer>
            )}
        </InfiniteLoader>)
    }
    render() {
        return (
            <div className={styles.root}>
                {/* 条件筛选栏 */}
                <Filter onFilter={this.onFilter}/>
                {/* 列表 */}
                {
                    this.renderList()
                }
            </div>
        )
    }
}
