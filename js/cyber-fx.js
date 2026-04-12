/**
 * CYBER_FX.JS
 * Handles Boot Sequence Preloader (CLI Style)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. BOOT SEQUENCE PRELOADER (CLI STYLE)
    // ==========================================
    const preloader = document.getElementById('cyber-preloader');
    const preloaderText = document.getElementById('preloader-text');
    const preloaderBar = document.getElementById('preloader-bar');
    
    if (preloader && preloaderText && preloaderBar) {
        // Prevent scrolling during boot
        document.body.style.overflow = 'hidden';
        if (window.lenis) window.lenis.stop();

        const bootSequence = [
            "BIOS Date 04/12/26 10:22:14 Ver 09.00.04",
            "CPU: Quantum Neural Processor @ 4.2GHz",
            "Memory Test: 65536K OK",
            "Initializing USB Controllers .. Done.",
            "Mounting /dev/sda1 on /boot ... [OK]",
            "Loading kernel modules ...",
            "[    0.014231] ACPI: Core revision 20260412",
            "[    0.082104] pci 0000:00:01.0: [10de:2204] type 00 class 0x030000",
            "[    0.154322] Unpacking initramfs...",
            "Starting SYSTEM_OVERRIDE daemon...",
            "Bypassing security protocols... [ACCESS GRANTED]",
            "Decrypting user interface... 100%",
            "root@charles-sys:~# ./start_ui.sh",
            "SYSTEM READY."
        ];

        let progress = 0;

        // Create a container for the lines and the blinking cursor
        const linesContainer = document.createElement('div');
        preloaderText.appendChild(linesContainer);
        
        const cursorSpan = document.createElement('span');
        cursorSpan.textContent = '█';
        cursorSpan.className = 'animate-pulse text-acid-green';
        preloaderText.appendChild(cursorSpan);

        const typeLine = async (text) => {
            const lineDiv = document.createElement('div');
            linesContainer.appendChild(lineDiv);
            
            // No typewriter effect, just print the whole line instantly
            lineDiv.textContent = text;
            preloaderText.scrollTop = preloaderText.scrollHeight;
        };

        const runBootSequence = async () => {
            for (let i = 0; i < bootSequence.length; i++) {
                await typeLine(bootSequence[i]);
                
                // Update progress bar
                progress = ((i + 1) / bootSequence.length) * 100;
                preloaderBar.style.width = `${progress}%`;
                
                // Extremely short delay between lines (0-10ms)
                let delay = Math.random() * 10;
                await new Promise(r => setTimeout(r, delay));
            }

            // Boot complete, fade out almost immediately
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                    // Restore scrolling
                    document.body.style.overflow = '';
                    if (window.lenis) window.lenis.start();
                }, 300); // Fast fade out
            }, 50); // Almost no wait before fading
        };

        runBootSequence();
    }
});
