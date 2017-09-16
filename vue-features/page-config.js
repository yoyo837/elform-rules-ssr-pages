import ajax from '../../components/ajax'

export default {
  async getPageData(pageParamList) {
    if (!(pageParamList instanceof Array) || pageParamList.length === 0) {
      throw Error('Miss arguments.')
    }
    const result = await ajax.postJSON('/pageConfig/dataList.do', pageParamList)
    return result
  }
}
