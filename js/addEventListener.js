// 绑定函数
document.getElementById('list_show').addEventListener("click", () => {
    listS(1)
})
document.getElementById('dropdown').addEventListener("change", () => {
    change(mode)
})
document.getElementById('list_disappear').addEventListener("click", () => {
    listS(0)
})