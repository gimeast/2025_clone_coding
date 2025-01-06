async function initPagination(fetchUrl, options, renderDataCallback) {
    const {
        pageSize = 10,
        maxPageButtons = 10,
        id = 0
    } = options;

    const firstPageButton = document.getElementById('firstPage');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const lastPageButton = document.getElementById('lastPage');
    const pageNumbers = document.getElementById('pageNumbers');

    let currentPage = 1; // 현재 페이지
    let totalPages = 0;  // 전체 페이지 수

    /**
     * 데이터를 가져오고 렌더링
     * @param {number} page - 가져올 페이지 번호
     */
    async function fetchData(page) {
        try {
            const params = new URLSearchParams({ page, size: pageSize });
            if (id) params.append('id', id);
            const url = `${fetchUrl}?${params.toString()}`;
            const response = await fetch(url);

            if (response.ok) {
                const json = await response.json();

                const data = json.content || []; // 서버에서 받아온 데이터
                totalPages = json.totalPages || 0;

                if (data.length === 0) {
                    console.log('No data found');
                    disableAllPaginationButtons();
                } else {
                    renderDataCallback(data); // 데이터 렌더링
                    renderPagination(page, totalPages); // 페이지네이션 렌더링
                }
            } else {
                console.error(`Failed to fetch data: HTTP ${response.status}`);
                disableAllPaginationButtons();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    /**
     * 페이지네이션 버튼 및 번호 렌더링
     * @param {number} current - 현재 페이지 번호
     * @param {number} total - 전체 페이지 수
     */
    function renderPagination(current, total) {
        currentPage = current; // 현재 페이지를 업데이트
        pageNumbers.innerHTML = ''; // 페이지 번호 초기화

        // 데이터 없는 경우 버튼 비활성화
        if (total === 0) {
            disableAllPaginationButtons();
            return;
        }

        const startPage = Math.floor((current - 1) / maxPageButtons) * maxPageButtons + 1;
        const endPage = Math.min(startPage + maxPageButtons - 1, total);

        // 버튼 활성화/비활성화
        firstPageButton.disabled = current === 1;
        prevPageButton.disabled = current === 1;
        nextPageButton.disabled = current === total;
        lastPageButton.disabled = current === total;

        // 동적으로 페이지 번호 렌더링
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = i === current ? 'active' : '';
            button.addEventListener('click', () => fetchData(i));
            pageNumbers.appendChild(button);
        }
    }

    /**
     * 모든 페이징 버튼 비활성화
     */
    function disableAllPaginationButtons() {
        firstPageButton.disabled = true;
        prevPageButton.disabled = true;
        nextPageButton.disabled = true;
        lastPageButton.disabled = true;
        pageNumbers.innerHTML = ''; // 페이지 번호 초기화
    }

    // 각 버튼에 이벤트 리스너 추가
    firstPageButton.addEventListener('click', () => fetchData(1)); // 처음 페이지 이동
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) fetchData(currentPage - 1); // 이전 페이지로
    });
    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) fetchData(currentPage + 1); // 다음 페이지로
    });
    lastPageButton.addEventListener('click', () => fetchData(totalPages)); // 마지막 페이지로 이동

    // 초기 데이터 로드
    await fetchData(currentPage);
}