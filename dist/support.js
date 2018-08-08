(function(w,d,e){

    var e = w.esq_support
    e.wrapper = null
    e.modal = null
    e.support = null
    e.element = null
    e.params = null


    e.contentPath = 'https://s3-eu-west-1.amazonaws.com/eventsquare.plugins/support'

    e.init = function(params,element) {
        e.params = params
        //Load stylesheet
        var head  = document.getElementsByTagName('head')[0]
        var link  = document.createElement('link')
        link.id   = 'es-support-style'
        link.rel  = 'stylesheet'
        link.type = 'text/css'
        link.href =  e.contentPath + '/support.min.css'
        link.media = 'all'
        head.appendChild(link)

        e.initModal()
    }

    e.initModal = function() {
        //Create elements
        e.wrapper = document.createElement('div')
        e.support = document.createElement('iframe')
        e.modal = document.createElement('div')

        var es_preloader = document.createElement('div')
        var es_preloader_animation = document.createElement('div')

        var es_logo = document.createElement('img')
        var es_close = document.createElement('img')

        //Define attributes
        es_logo.src = e.contentPath + "/images/es-logo-dark.svg"
        es_close.src = e.contentPath + "/images/icon-error.svg"

        //Add classes
        e.wrapper.classList.add( "es-support-modal-wrapper")
        e.support.classList.add("es-support-iframe")
        e.support.setAttribute("id", "es-container");

        e.modal.classList.add("es-support-modal")

        es_preloader.classList.add("es-support-modal-preloader")
        es_preloader_animation.classList.add("es-support-modal-preloader-animation")

        //Append elements
        e.wrapper.appendChild(e.modal)
        e.wrapper.appendChild(es_preloader)
        es_preloader.appendChild(es_preloader_animation)

        e.modal.appendChild(e.support)

        //Listeners
        e.wrapper.onclick = function() {
            e.hide()
        }
        e.support.onload = function() {
            if(e.support.src){
                e.modal.classList.add("es-support-modal-open")
            }
        }
        w.onresize = function(event) {
            e.layout()
        }
        document.body.appendChild(e.wrapper)
    }
    e.show = function() {
        var get_values = e.build_query(e.params)
        get_values = get_values ? '?' + get_values : ""
        if(!e.support.src){
            e.support.src = "https://support.eventsquare.io"
        }
        e.support.src += get_values
        e.wrapper.classList.add("es-support-modal-open")
        e.layout()
    }
    e.hide = function() {
        e.wrapper.classList.remove("es-support-modal-open")
    }
    e.layout = function() {
        var height = w.innerHeight - 100
        e.modal.style.height = height + "px"
    }
    e.setContentPath = function (path) {
        e.contentPath = path
    }
    e.setSrcPath = function (path) {
        e.support.src = path
    }
    e.callMethod = function(method,arguments){
        if(typeof eval('e.' + method) !== 'undefined'){
            eval('e.' + method).apply(e,arguments)
        } else {
            console.error('The "' + method + '" method is not available in EventSquare')
        }
    }
    e.runQueue = function() {
        if(e.queue.length){
            for(i=0;i<e.queue.length;i++){
                var arguments = Array.prototype.slice.call(e.queue[i])
                arguments.shift()
                e.callMethod(e.queue[i][0],arguments)
            }
        }
    }
    e.runQueue()

    e.build_query = function (obj, num_prefix, temp_key) {

        var output_string = []
        if(!obj) return ""

        Object.keys(obj).forEach(function (val) {

            var key = val

            num_prefix && !isNaN(key) ? key = num_prefix + key : ''

            var key = encodeURIComponent(key.replace(/[!'()*]/g, escape))
            temp_key ? key = temp_key + '[' + key + ']' : ''

            if (typeof obj[val] === 'object') {
                var query = build_query(obj[val], null, key)
                output_string.push(query)
            }

            else {
                var value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape))
                output_string.push(key + '=' + value)
            }

        })

        return output_string.join('&')
    }
    window.addEventListener('message', function(event) {
        if(event.data === 'close') {
            e.hide()
        }
        if(event.data[0]=='setHeight'){
            var height = Math.min((w.innerHeight - 30), event.data[1])
            e.support.style.height = height + 'px'
            e.modal.style.height = height + 'px'
        }
   });

}(window,document))
