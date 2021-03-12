const siblingTable = document.querySelector('.sibling-table')
const siblingRadio = document.querySelectorAll('.sibling-radio')

const siblingSearchRadio = document.querySelectorAll('.sibling-search-radio')
const siblingSearchButton = document.querySelector('.sibling-search-button')
const siblingSearchInput = document.querySelector('.sibling-search-input') 
const siblingSearchResult = document.querySelector('.sibling-search-result')

siblingRadio.forEach(radio => {
    radio.addEventListener('change', (e) => {
        e.target.value === 'yes' ? siblingTable.style.display = 'inline-block' : siblingTable.style.display = 'none'    
    })
})

siblingSearchButton.addEventListener('click', async () => {
    const response = await fetch('/api/student-record')
    const data = await response.json()

    siblingSearchRadio.forEach(radio => {
        if (radio.checked) {
            const filteredData = data.filter(stud => {
                return stud[radio.value] === siblingSearchInput.value
            })
            
            if (filteredData) {
                siblingSearchResult.style.display = "block"

                filteredData.forEach(data => {
                    const tr = document.createElement('tr')
                    const info = [data.firstname, data.middlename, data.lastname, data.lrn]

                    for(let x = 0; x < 5; x++) {
                        const td = document.createElement('td')

                        if (x < 4) {
                            const text = document.createTextNode(info[x])
                            td.appendChild(text)
                            tr.appendChild(td)
                        } else {
                            const actionText = document.createTextNode("Select")
                            td.appendChild(actionText)
                            tr.appendChild(td)
                        }     
                    }

                    siblingSearchResult.appendChild(tr)
                })
            } else {
                siblingSearchResult.style.display = "none"
            }
        }
    })

})