console.log("Hello from the JS file!");

load_data().then(r => console.log(r));

async function load_data() {
    try {
        const response = await fetch('/data');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } catch (e) {
        console.log('fetchPosts:', e);
    }
}

function display_data(display_container_id) {
    const containerElement = document.getElementById(`${display_container_id}`);

    if (!containerElement) {
        return;
    }

    load_data()
        .then((data) => {
            if (!data) {
                containerElement.innerText = 'Could not get data :(';
            }
        /*    for (const d of data) {
                containerElement.appendChild(addElement(d));
            } */
            containerElement.appendChild(addElement(data));
        })
        .catch((e) => {
            console.log('listPosts:', e);
        });
}

function addElement(elem) {
    const paragraph = document.createElement('p');
    //anchorElement.setAttribute('href', `${apiUrl}/posts/${post.id}`);
    //anchorElement.setAttribute('target', '_blank');
    paragraph.innerText = JSON.stringify(elem);
    return paragraph;
  }