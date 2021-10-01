// 绑定函数
document.getElementById('list_show').addEventListener("click", () => {
    listS(1)
})
document.getElementById('背词').addEventListener("click", () => {
    change(0)
})
document.getElementById('拼写').addEventListener("click", () => {
    change(1)
})
document.getElementById('dropdown').addEventListener("change", () => {
    change(mode)
})
document.getElementById('list_disappear').addEventListener("click", () => {
    listS(0)
})
document.getElementById('左箭头').addEventListener("click", () => {
    next(n - 1)
})
document.getElementById('等号').addEventListener("click", () => {
    answer()
})
document.getElementById('右箭头').addEventListener("click", () => {
    next(n + 1)
})