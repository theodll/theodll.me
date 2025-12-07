<script>
  import { onMount, tick } from 'svelte';

  onMount(() => {
    startBoot();
  });

  let booted = false;
  let booting = false;
  let terminalElement;
  let inputElement;
  
  let history = [];
  let currentInput = "";
  
  const bootSequence = [
  "> SYSTEM BOOT SEQUENCE INITIATED...",
  "> CHECKING MEMORY... 64KB OK",
  "> PERFORMING EXTENDED MEMORY DIAGNOSTICS... OK",
  "> VERIFYING MEMORY SEGMENT ALIGNMENT... OK",
  "> LOADING KERNEL... OK",
  "> VERIFYING KERNEL SIGNATURE... VALID",
  "> INITIALIZING INTERRUPT VECTORS... OK",
  "> REGISTERING HARDWARE INTERRUPTS... OK",
  "> SCANNING CONNECTED DEVICES... 7 FOUND",
  "> PROBING PCI BUS... OK",
  "> INITIALIZING DMA CHANNELS... OK",
  "> LOADING VIDEO DRIVER... OK",
  "> LOADING AUDIO SUBSYSTEM... OK",
  "> INITIALIZING /dev/random... OK",
  "> CONFIGURING NETWORK INTERFACE... OK",
  "> LOOPBACK TEST... OK (127.0.0.1 responded immediately)",
  "> DHCP REQUEST... OK",
  "> MOUNTING VOLUMES... OK",
  "> CHECKING FILE SYSTEM INTEGRITY... CLEAN",
  "> REPLAYING JOURNAL... OK",
  "> VALIDATING USERSPACE BRIDGE... OK",
  "> LOADING SHELL PROFILES... OK",
  "> FETCHING ENVIRONMENT VARIABLES... OK",
  "> ALLOCATING STACKS... OK",
  "> INITIALIZING SCHEDULER... OK",
  "> ACTIVATING KERNEL PREEMPTION... OK",
  "> WARMING UP FPU... OK",
  "> TESTING SIMD REGISTERS... OK (AVX2 AVAILABLE)",
  "> INITIALIZING POWER MANAGEMENT... OK",
  "> LOADING OPTIONAL MODULES... OK",
  "> DETECTING USER: THEO.DLL",
  "> LOADING USER PROFILE... OK",
  "> AUTHENTICATING SESSION... OK",
  "> PREPARING USERSPACE...",
  "> STARTING BACKGROUND SERVICES... OK",
  "> SYNCING SYSTEM CLOCK... OK",
  "> CLEARING TEMPORARY BUFFERS... OK",
  "> FINALIZING INIT SEQUENCE...",
  "> ACCESS GRANTED.",
  "> SYSTEM READY.",
  "> TRY NOT TO OPEN VIM IN FULLSCREEN THIS TIME."
];


  const commands = {
    help: "AVAILABLE COMMANDS: HELP, VELT, GITHUB, CLEAR, WHOAMI",
    velt: "OPENING VELT GAME ENGINE REPOSITORY...",
    projects: "LOADING PROJECTS \n - VELT: A CUSTOM C++ GAME ENGINE (GITHUB.COM/THEODLL/VELT) \n - FLOURINEOS: 32BIT OPERATING SYSTEM (GITHUB.COM/THEODLL/FLOURINEOS) \n - THEO.DLL: PERSONAL WEBSITE (GITHUB.COM/THEODLL/THEODLL.ME)",
    about: "I'M THEO, A C++ DEVELOPER BUILDING MY OWN CUSTOM GAME ENGINE CALLED VELT. THATS PRETTY MUCH IT.",
    github: "OPENING GITHUB PROFILE...",
    whoami: "I'M A C++ DEVELOPER WORKING ON MY GAME ENGINE.",
    clear: "CLEARING TERMINAL..."
  };

  async function playDialUpSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    
    // Carrier tone
    const osc1 = ctx.createOscillator();
    osc1.frequency.value = 1800;
    const gain1 = ctx.createGain();
    gain1.gain.value = 0.1;
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 2.5);

    // Handshake pulses
    const osc2 = ctx.createOscillator();
    osc2.frequency.value = 2100;
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.1;
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    // Modulation
    osc2.start(t);
    osc2.stop(t + 2.5);
    
    // Noise (static)
    const bufferSize = ctx.sampleRate * 2.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
  }

  async function startBoot() {
    booting = true;
    
    // Try to go fullscreen

    // playDialUpSound();

    let i = 0;

    for (let line of bootSequence) {
      i++;
      history = [...history, { type: 'output', text: line }];
      await new Promise(r => setTimeout(r, Math.random() * 100 + 100));
      scrollToBottom();

      if (i === bootSequence.length - 3) {
          history = []; 
      }
    }

    await new Promise(r => setTimeout(r, 500));
    
    history = [...history, 
      { type: 'output', text: "" },
      { type: 'output', text: "WELCOME TO THEO.DLL TERMINAL v1.0" },
      { type: 'output', text: "TYPE 'HELP' FOR COMMANDS." },
      { type: 'output', text: "TYPE 'PROJECTS' TO SEE MY WORK." },
      { type: 'output', text: "TYPE 'ABOUT' TO LEARN MORE ABOUT ME." },
      { type: 'output', text: "TYPE 'GITHUB' TO VISIT MY PROFILE." },
      { type: 'output', text: "" }
    ];
    
    booting = false;
    booted = true;
    await tick();
    inputElement?.focus();
    scrollToBottom();
  }

  function scrollToBottom() {
    if (terminalElement) {
      terminalElement.scrollTop = terminalElement.scrollHeight;
    }
  }

  async function handleKeydown(e) {
    if (e.key === 'Enter') {
      const cmd = currentInput.trim().toLowerCase();
      history = [...history, { type: 'input', text: currentInput }];
      currentInput = "";

      if (cmd === 'clear') {
        history = [];
      } else if (commands[cmd]) {
        history = [...history, { type: 'output', text: commands[cmd] }];
        
        if (cmd === 'velt') {
            setTimeout(() => window.open('https://www.github.com/theodll/velt', '_blank'), 1000);
        } else if (cmd === 'github') {
            setTimeout(() => window.open('https://github.com/theodll', '_blank'), 1000);
        }
      } else if (cmd !== "") {
        history = [...history, { type: 'output', text: `COMMAND NOT FOUND: ${cmd}` }];
      }
      
      await tick();
      scrollToBottom();
    }
  }

  function focusInput() {
    if (booted) inputElement?.focus();
  }
</script>

<svelte:head>
  <title>theo.dll</title>
</svelte:head>

<svelte:window on:click={focusInput} />

<div class="min-h-screen bg-black text-green-500 font-mono p-4 sm:p-8 overflow-hidden flex flex-col text-xl" bind:this={terminalElement}>
    <div class="flex-1 max-w-4xl w-full mr-auto">
      {#each history as line}
        <div class="mb-1 break-words {line.type === 'input' ? 'text-green-300' : 'text-green-500'}">
          {#if line.type === 'input'}
            <span class="mr-2">></span>
          {/if}
          {line.text}
        </div>
      {/each}
      
      {#if booted}
        <div class="flex items-center mt-2">
          <span class="mr-2 text-green-300">></span>
          <input 
            bind:this={inputElement}
            bind:value={currentInput}
            on:keydown={handleKeydown}
            type="text" 
            class="bg-transparent border-none outline-none flex-1 text-green-300 font-mono uppercase caret-green-500"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      {/if}
    </div>
</div>

<style>
  /* Custom scrollbar for webkit */
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: #000; 
  }
  ::-webkit-scrollbar-thumb {
    background: #003300; 
    border: 1px solid #00ff00;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #004400; 
  }
</style>
