const counters = document.querySelectorAll('.counter');

        counters.forEach(counter => {
            let tempCount = 0;
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                // const count = +counter.innerText;
                
                // Lower inc to slow and higher to slow
                const inc = target / 200

                // console.log(inc);
                // console.log(count);

                // Check if target is reached
                if (tempCount < target) {
                    // Add inc to count and output in counter 
                    tempCount = tempCount + inc  
                    counter.innerText = Math.ceil(tempCount)
                    
                    // Call function every ms
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
});