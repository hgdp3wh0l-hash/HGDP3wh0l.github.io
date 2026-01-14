// 等待整个页面加载完毕
document.addEventListener('DOMContentLoaded', function() {

    // ========== 2. 技能条动画 ==========
    const skillBars = document.querySelectorAll('.skill-level');

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const parent = bar.parentElement;
            const level = parent.getAttribute('data-level');
            if (!parent.classList.contains('animated')) {
                setTimeout(() => {
                    bar.style.width = level + '%';
                    parent.classList.add('animated');
                }, 200);
            }
        });
    }

    const skillsSection = document.getElementById('about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // ========== 3. 导航栏滚动高亮 ==========
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateNavHighlight() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.style.color = '#0984e3';
                link.style.fontWeight = 'bold';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });
    }

    window.addEventListener('scroll', updateNavHighlight);

    // ========== 4. 视频模态框系统 ==========
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const projectButtons = document.querySelectorAll('.project-btn');

    // 打开模态框
    projectButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');

            if (targetId) {
                const modal = document.getElementById(targetId);
                if (modal) {
                    openModal(modal);
                }
            } else {
                // 没有视频的项目显示提示
                const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
                alert(`项目"${projectTitle}"的详细展示正在开发中`);
            }
        });
    });

    // 关闭模态框
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // 点击背景关闭
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });

    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // 初始化视频控制
        const videoId = modal.id.replace('modal', '');
        const video = modal.querySelector(`#projectVideo${videoId}`);
        if (video) {
            video.currentTime = 0;
            updateTimeDisplay(videoId, video);
        }
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // 暂停所有视频
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => video.pause());
    }

    // ========== 5. 视频控制功能 ==========
    function setupVideoControls(videoNumber) {
        const video = document.getElementById(`projectVideo${videoNumber}`);
        const playBtn = document.querySelector(`.play-btn[data-video="${videoNumber}"]`);
        const muteBtn = document.querySelector(`.mute-btn[data-video="${videoNumber}"]`);
        const timeDisplay = document.querySelector(`.time-display[data-video="${videoNumber}"]`);

        if (!video || !playBtn || !muteBtn || !timeDisplay) return;

        // 播放/暂停
        playBtn.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                this.innerHTML = '<i class="fas fa-pause"></i> 暂停';
            } else {
                video.pause();
                this.innerHTML = '<i class="fas fa-play"></i> 播放';
            }
        });

        // 静音
        muteBtn.addEventListener('click', function() {
            video.muted = !video.muted;
            this.innerHTML = video.muted ?
                '<i class="fas fa-volume-mute"></i> 取消静音' :
                '<i class="fas fa-volume-up"></i> 静音';
        });

        // 时间更新
        video.addEventListener('timeupdate', function() {
            updateTimeDisplay(videoNumber, video);
        });

        // 播放状态监听
        video.addEventListener('play', function() {
            playBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
        });

        video.addEventListener('pause', function() {
            playBtn.innerHTML = '<i class="fas fa-play"></i> 播放';
        });

        // 加载完成
        video.addEventListener('loadedmetadata', function() {
            updateTimeDisplay(videoNumber, video);
        });

        // 错误处理
        video.addEventListener('error', function() {
            timeDisplay.textContent = '加载失败';
            playBtn.disabled = true;
        });
    }

    function updateTimeDisplay(videoNumber, video) {
        const timeDisplay = document.querySelector(`.time-display[data-video="${videoNumber}"]`);
        if (timeDisplay && !isNaN(video.duration)) {
            const current = formatTime(video.currentTime);
            const duration = formatTime(video.duration);
            timeDisplay.textContent = `${current} / ${duration}`;
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 初始化视频的控制
    setupVideoControls(1);
    setupVideoControls(2);
    setupVideoControls(3);
    setupVideoControls(6);

    // ========== 6. 项目卡片悬停效果 ==========
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
        });
    });

    // ========== 7. 项目4模态框控制 ==========
    // 初始化第四个项目的模态框（静态图片展示）
    const modal4Btn = document.querySelector('.project-btn[data-target="modal4"]');
    if (modal4Btn) {
        modal4Btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = document.getElementById('modal4');
            if (modal) {
                openModal(modal);
            }
        });
    }

    // ========== 8. 项目4图片点击预览功能 ==========
    const modal4Images = document.querySelectorAll('#modal4 .system-image img');
    modal4Images.forEach(img => {
        img.addEventListener('click', function() {
            const src = this.src;
            const alt = this.alt;
            const description = this.parentElement.querySelector('p').textContent;

            // 创建图片预览模态框
            const previewModal = document.createElement('div');
            previewModal.className = 'modal';
            previewModal.style.display = 'block';
            previewModal.innerHTML = `
                <div class="modal-content" style="max-width: 90%; max-height: 90vh; background: transparent; box-shadow: none; margin: 5vh auto;">
                    <span class="close-modal" style="position: absolute; top: 20px; right: 20px; z-index: 3000; color: white; font-size: 2.5rem; cursor: pointer;">&times;</span>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <img src="${src}" alt="${alt}" style="width: 100%; max-height: 70vh; object-fit: contain; border-radius: 10px; background: #000;">
                        <p style="text-align: center; color: white; margin-top: 15px; font-size: 1.1rem; background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 20px;">${description}</p>
                    </div>
                </div>
            `;

            document.body.appendChild(previewModal);

            // 关闭预览
            const closePreview = previewModal.querySelector('.close-modal');
            closePreview.addEventListener('click', function() {
                document.body.removeChild(previewModal);
            });

            previewModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    document.body.removeChild(previewModal);
                }
            });

            // ESC键关闭预览
            document.addEventListener('keydown', function closeOnEsc(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(previewModal);
                    document.removeEventListener('keydown', closeOnEsc);
                }
            });
        });
    });

    // ========== 9. 所有项目卡片悬停效果增强 ==========
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
            if (this.hasAttribute('data-modal')) {
                this.style.transform = 'translateY(-10px)';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            if (this.hasAttribute('data-modal')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // ========== 10. 移除原来的联系链接功能 ==========
    // 原来的联系链接功能已移除，替换为静态联系方式展示

    // ========== 11. 页面加载动画 ==========
    // 添加简单的加载完成动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';

        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // ========== 12. 控制台欢迎信息 ==========
    console.log('%c🎓 杨镇华 - 个人作品集', 'color: #0984e3; font-size: 16px; font-weight: bold;');
    console.log('%c成都理工大学 | 数字媒体与技术 | 本科', 'color: #00b894;');
    console.log('%cAIGC创作 / Unity游戏开发 / 交互设计', 'color: #6c5ce7;');
    console.log('%c-----------------------------', 'color: #636e72;');
    console.log('%c📞 联系方式：18584105909', 'color: #0984e3; font-weight: bold;');
    console.log('%c📧 邮箱：yzh18584105909@163.com', 'color: #0984e3; font-weight: bold;');
    console.log('%c-----------------------------', 'color: #636e72;');
    console.log('%c作品项目展示：', 'color: #6c5ce7; font-weight: bold;');
    console.log('%c1. Unity 3D追逃小游戏', 'color: #e17055;');
    console.log('%c2. UE5.4生存跑酷游戏', 'color: #fd79a8;');
    console.log('%c3. YOLOv8车辆检测系统', 'color: #74b9ff;');
    console.log('%c4. AIGC短片《进化-文明》', 'color: #a29bfe;');
    console.log('%c5. 微信小程序房产AI应用', 'color: #07c160;');
    console.log('%c6. 古诗词意境动画', 'color: #55efc4;');
});

// ========== 13. 项目5模态框控制 ==========
const modal5Btn = document.querySelector('.project-btn[data-target="modal5"]');
if (modal5Btn) {
    modal5Btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const modal = document.getElementById('modal5');
        if (modal) {
            openModal(modal);
        }
    });
}

// ========== 14. 项目5图片点击预览 ==========
const modal5Images = document.querySelectorAll('#modal5 .system-image img');
modal5Images.forEach(img => {
    img.addEventListener('click', function() {
        const src = this.src;
        const description = this.parentElement.querySelector('p').textContent;

        // 创建图片预览模态框
        const previewModal = document.createElement('div');
        previewModal.className = 'modal';
        previewModal.style.display = 'block';
        previewModal.innerHTML = `
            <div class="modal-content" style="max-width: 90%; max-height: 90vh; background: transparent; box-shadow: none; margin: 5vh auto;">
                <span class="close-modal" style="position: absolute; top: 20px; right: 20px; z-index: 3000; color: white; font-size: 2.5rem; cursor: pointer;">&times;</span>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="${src}" alt="${description}" style="width: 100%; max-height: 70vh; object-fit: contain; border-radius: 10px; background: #000;">
                    <p style="text-align: center; color: white; margin-top: 15px; font-size: 1.1rem; background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 20px; border: 1px solid #07c160;">${description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(previewModal);

        // 关闭预览
        const closePreview = previewModal.querySelector('.close-modal');
        closePreview.addEventListener('click', function() {
            document.body.removeChild(previewModal);
        });

        previewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                document.body.removeChild(previewModal);
            }
        });

        // ESC键关闭预览
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(previewModal);
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    });
});
// ========== 项目6模态框控制 ==========
const modal6Btn = document.querySelector('.project-btn[data-target="modal6"]');
if (modal6Btn) {
    modal6Btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const modal = document.getElementById('modal6');
        if (modal) {
            openModal(modal);
        }
    });
}