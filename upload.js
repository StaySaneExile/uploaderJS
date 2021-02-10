function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}
const element = (tag, classes= [], content) => {
    const node = document.createElement(tag)
    if(classes.length) {
        node.classList.add(...classes)
    }
    if(content) {
        node.textContent = content
    }
    return node
}
const noop = function () {}

export function upload(selector, options = {}) {
    let files = []
    const onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector)
    const preview = element('div', ['preview'])
    const buttOpen = element('button', ['btn'], 'Open' )
    const buttUpload = element('button', ['btn', 'primary'], 'Upload' )
    buttUpload.style.display = 'none'

    if (options.multi) {
        input.setAttribute('multiple', true)
    }
    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', buttUpload)
    input.insertAdjacentElement('afterend', buttOpen)

    const clearPreview = (el) => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="preview-info-progress"></div>'

    }
    const triggerInput = () => input.click()
    const changeHandler = (event) => {
        if (!event.target.files.length) {
            return
        }

        files = Array.from(event.target.files)
        preview.innerHTML = ''
        buttUpload.style.display = 'inline'

        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()

            reader.onload = ev => {

                const src = ev.target.result
                preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-img">
                <div class="preview-remove" data-name="${file.name}">x</div>
                    <img src="${src}" alt="${file.name}"/>
                    <div class="preview-info">
                    <span>${file.name}</span>
                    <span>${bytesToSize(file.size)}</span>                    
                    </div>
                </div>
                `)
            }

            reader.readAsDataURL(file)
        })


    }
    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return
        }

        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)

        if(!files.length) {
            buttUpload.style.display = 'none'
        }

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-img')

        block.classList.add('removing')
        setTimeout(()=> {
            block.remove()
        },300)

    }
    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach( el => el.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files)
    }

    buttOpen.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    buttUpload.addEventListener('click', uploadHandler)
}