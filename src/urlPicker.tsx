const URL_KEY = 'url'

export const getUrl = () => {
  return  localStorage.getItem(URL_KEY) || 'http://localhost:3000'
}

export const UrlPicker = () => {
  const url = getUrl()
  console.log("url:", url);

  const setUrl = (newUrl: string) => {
    localStorage.setItem(URL_KEY, newUrl)
    location.reload()   //刷新页面,注意这个方法会重新加载页面，而不是只刷新页面的一部分，所以会导致redux store中的数据变为初始值
  }

  return <div className={'absolute right-0 shadow bg-orange-200 p-1 z-50'}>
    <select className={'px-2 py-0'} value={url} onChange={(e) => setUrl(e.target.value)}>
      <option value={'http://localhost:3000'}>localhost</option>
      <option value={'http://16.16.172.121:3000/'}>Ubuntu Server</option>
    </select>
  </div>
}