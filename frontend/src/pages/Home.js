import React from 'react';
import '../styles/Home.css';  // 새로운 CSS 파일을 만들어 스타일을 추가할 수 있습니다.

const Home = () => {
    const handleExport = async () => {
        try {
            const response = await fetch('/api/export_database');
            if (!response.ok) {
                throw new Error('Failed to export database');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // Get the filename from the Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'database_export.txt';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                if (filenameMatch.length === 2)
                    filename = filenameMatch[1];
            }
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting database:', error);
            alert('Failed to export database. Please try again.');
        }
    };

    return (
        <div className="home-container">
            <h2>주사위 웹 애플리케이션에 오신 것을 환영합니다</h2>
            <p>이 앱을 사용하여 주사위를 관리하고, 면을 추가하고, 주사위를 굴릴 수 있습니다.</p>
            <ul>
                <li>주사위 페이지에서 주사위를 추가하거나 제거할 수 있습니다</li>
                <li>면 페이지에서 주사위에 면을 추가할 수 있습니다</li>
                <li>굴리기 페이지에서 주사위를 굴리고 결과를 저장할 수 있습니다</li>
            </ul>
            <button onClick={handleExport} className="export-button">데이터베이스 내보내기</button>
        </div>
    );
};

export default Home;