const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const apiImage = "https://shoppy-db.herokuapp.com/image"
const contentWrap = $('.content-wrap')
const app = $('.app')

getImage(apiImage)

function getImage() {
    fetch(apiImage).then((response) => {
        return response.json();
    }).then((images) => {
        render(images);
        handlerLike(images);
        handlerZoom(images);
        handlerAdd(images);
        handlerDelete()
        handlerSearch(images)
    })
}
function create(data) {
    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    fetch(apiImage, option).then((response) => {
        return response.json()
    }).then(data => {
        alert("Thêm Thành Công");
    }).catch((error) => {
        console.error('Error:', error);
    });
}
function patchImage(data) {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(apiImage + '/' + data.id, options).then((response) => {
        return response.json();
    }).then(() => {
        alert('Đã Like')
    })
}
function deleteImage(id) {
    fetch(apiImage + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        return response.json();
    }).then(() => {
        alert('Xoá Thành Công')
    })
}
function render(image) {
    let image2 = image.reverse()
    let htmls = image2.map((e) => {

        // xu ly thoi gian up anh
        let date = new Date();
        let now = date.getTime();
        let distance = now - e.uptime;
        let timeCreate = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        // console.log(timeCreate);

        // xu ly hastag
        let gethastag = e.hashtag.map((e2) => {
            if (!(e2 == '')) {
                return `<span>#${e2}</span>`
            }
        }).join('');
        return ` <div class="content__items ">
                    <div class="group" data-position = ${e.id}  style = "background-image: url('${e.links}')">
                        <i class="ti-camera"></i>
                    <input type="checkbox" class="delete-checkbox checkbox-hide" id="">
                        <div class="content__items-wrap">
                            <div class="content__items-hashtag">
                                <span class="ti-tag"></span>
                               ${gethastag}
                            </div>
                            <div class="content__items-time">
                                <div class="content__items-time-wrap">
                                    <span class="ti-time"></span>
                                    <p>${timeCreate} mins</p>
                                </div>
                                <div class="like" >
                                    <span class="ti-heart" data-position = ${e.id}></span>
                                    <p>${e.like}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
    }).join("");
    contentWrap.innerHTML = htmls
}
function handlerZoom(images) {
    const item = $$('.group');
    const menu = $('.menu');
    const content = $('.content');
    const zoom = $('.zoom');
    const btnClose = $('.zoom-close');
    const zoomImage = $('.zoom-image img');
    const hashtags = $('.zoom-hashtag');

    item.forEach(element => {

        element.addEventListener('click', () => {
            menu.classList.add('transform-left');
            content.classList.add('transform-right');
            setTimeout(() => {
                zoom.classList.remove('zoom-hide');
            }, 500)
            let id = element.dataset.position - 1
            zoomImage.src = images[id].links
            let gethastag = images[id].hashtag.map((e) => {
                return ` <span>#${e}</span>`
            }).join('');
            hashtags.innerHTML = gethastag;
        });
    });
    btnClose.addEventListener('click', () => {
        zoom.classList.add('zoom-hide');
        menu.classList.remove('transform-left');
        content.classList.remove('transform-right');
    })
}
function handlerLike(images) {
    let image2 = images.reverse()
    const btnLike = $$('.like span')
    btnLike.forEach((element) => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            let index = element.dataset.position - 1;
            image2[index].like++
            element.parentElement.lastElementChild.textContent = image2[index].like;
            let data = {
                id: element.dataset.position,
                like: images[index].like,
            }
            patchImage(data);
        })
    })

}
function handlerAdd(images) {
    const btnAdd = $('.add');
    const addImage = $('.add-image');
    const linkImage = $('.add-image-link');
    const hashtagImage = $('.add-image-hashtag');
    const btnSubmit = $('.add-image-btn-add');
    const reviewImage = $('.add-image-body img');
    const btnCloseAdd = $('.add-image-close');


    btnAdd.addEventListener('click', () => {
        addImage.classList.remove('add-hide')
    })
    linkImage.onblur = () => {
        if (!(linkImage.value === '')) {
            reviewImage.src = linkImage.value;
        }
    }

    btnSubmit.addEventListener('click', () => {
        let date = new Date()
        let createTime = date.getTime()
        let arrHashTag = hashtagImage.value.trim().split('#').slice(0)
        arrHashTag.shift()
        if (!(hashtagImage.value === '')) {
            let data = {
                id: images.length + 1,
                hashtag: arrHashTag,
                links: linkImage.value,
                uptime: createTime,
                like: 0
            };
            create(data)
        }
    });
    btnCloseAdd.addEventListener('click', () => {
        addImage.classList.add('add-hide')

    })

}
function handlerSearch(images) {
    const btnSearch = $('.btn-search');
    const inputSearch = $('.menu-navbar__search-item');
    btnSearch.addEventListener('click', () => {
        let valueInput = inputSearch.value.trim()
        let newValue = valueInput.slice(1);
        let resultSearch = []
        if (!(newValue == '') && (inputSearch.value.trim().slice(0, 1) === "#")) {
            images.forEach((e, index) => {
                let a = e.hashtag.includes(newValue)
                if (a) {
                    resultSearch.push(images[index])
                    render(resultSearch)
                }
            });
        }
    })
}
function handlerDelete() {
    const btnDelete = $('.delete');
    const checkbox = $$('.delete-checkbox');
    btnDelete.addEventListener('click', (eDelete) => {
        checkbox.forEach(eCheckBox => {
            eCheckBox.classList.toggle('checkbox-hide');
            eCheckBox.addEventListener('click', (eCheckBoxClick) => {
                eCheckBoxClick.stopPropagation()
            })
        })
        if (btnDelete.classList.toggle('confirm')) {
            btnDelete.textContent = 'confirm'
            const btnConfirm = $('.confirm');
            btnConfirm.addEventListener('click', () => {
                checkbox.forEach((eCheckBox) => {
                    if (eCheckBox.checked) {
                        let id = eCheckBox.offsetParent.dataset.position
                        deleteImage(id)
                    }
                })
            })
        } else {
            btnDelete.textContent = 'Delete'
        }


    })
}

