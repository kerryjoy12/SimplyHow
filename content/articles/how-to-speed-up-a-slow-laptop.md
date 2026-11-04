---
title: How to Speed Up a Slow Laptop: 15 Fixes That Actually Work
slug: how-to-speed-up-a-slow-laptop
description: Fix a slow laptop in 30 minutes with 15 tested steps - from startup cleanup and RAM upgrades to malware scans and power settings.
keywords: speed up slow laptop, make laptop faster, laptop running slow, speed up Windows laptop, improve laptop performance
category: technology
tags: laptops, performance, Windows, troubleshooting
author: The SimplyHow Editorial Team
date: 2026-10-12
updated: 2026-10-12
featured: true
faqs:
  - q: Why is my laptop suddenly so slow?
    a: The most common causes are too many programs starting with Windows, a nearly full or failing hard drive, background updates, malware, or accumulated dust blocking cooling. Work through the fixes in order and you will usually find the culprit within an hour.
  - q: Will resetting my laptop make it fast again?
    a: A factory reset usually restores near-original speed, but it also deletes your programs and files. It is a last resort - try startup cleanup, a malware scan and a drive health check first, because those fixes solve the problem without any data loss.
  - q: How much RAM do I need for a laptop to run fast?
    a: For everyday browsing, office work and streaming, 8 GB is the practical minimum and 16 GB feels comfortably fast. If your laptop has 4 GB and you keep dozens of tabs open, a RAM upgrade is usually the single biggest improvement you can buy.
  - q: Does deleting files actually make a laptop faster?
    a: It helps mainly when the system drive is completely full (above about 90 percent), because Windows needs free space for temporary files and virtual memory. On a modern SSD with plenty of free space, deleting files improves storage headroom more than day-to-day speed.
  - q: How do I know if my laptop hard drive is failing?
    a: Warning signs include files that suddenly become unavailable, long freezes, clicking or grinding noises, and the drive disappearing from the system. Back up your data immediately and run the drive health check in step 12 - a failing drive must be replaced, not cleaned up.
---

A laptop that used to fly now takes two minutes to open a browser, stalls mid-typing, and fans up when you touch the touchpad. It is one of the most frustrating problems in computing, and one of the most fixable. In most cases a slow laptop is not dying hardware - it is a software backlog: too many programs launching at startup, a drive stuffed to the brim, a year of updates half-installed, or background processes you never agreed to.

This guide walks you through 15 fixes in the order that produces the fastest results first. Work down the list, checking your laptop's responsiveness after each stage. Most machines recover most of their speed in the first three steps, which take about 20 minutes combined. You will not need to buy anything until step 10, and several fixes are one-click operations.

The only things you need are your laptop, its power adapter, and about an hour if you work through everything. If you use a [Windows laptop](/category/technology/) the steps below use Windows 10 and Windows 11 screenshots names; macOS equivalents are noted where they exist.

## Why Your Laptop Slows Down Over Time

Understanding the cause helps you prevent the problem from returning. Laptops rarely slow down because of a single event; they slow down through accumulation.

**Startup creep.** Every app you install wants a piece of boot time. Messengers, update helpers, cloud sync clients, game launchers and printer utilities all register themselves to launch at login. After two years, a laptop can easily boot 15 background programs instead of three. Each one also sits in RAM and competes for CPU while you work.

**Storage pressure.** Windows needs free disk space for virtual memory, temporary files and update staging. When a drive passes roughly 90 percent full, performance drops sharply - especially on a hard disk drive (HDD), where the operating system must physically hunt for empty blocks. On solid-state drives (SSD), a nearly full drive has less room for wear levelling, which slows writes.

**Background churn.** Windows Update, antivirus definition downloads, OneDrive or Google Drive sync, browser updates and app auto-updaters all run silently. On a slow connection they compete with your work, and a machine that never finishes updating never stops working in the background.

**Thermal throttling.** Dust clogs the fan and heatsink, temperatures climb, and the processor deliberately slows itself to survive. A laptop that runs hot and loud is often a laptop running at half speed.

**Malware and adware.** Browser toolbars, "system optimizers" and crypto-miners consume resources while pretending to be helpful. If a laptop became slow almost overnight and you did not install anything, suspect this.

**Hardware limits.** 4 GB of RAM with a mechanical hard drive was entry-level hardware a decade ago. Modern websites alone can consume 2 GB. Sometimes the honest fix is an upgrade, and we cover exactly which one to buy in step 10.

## Before You Start: Three Precautions

Run through these first; they take five minutes and protect you from trouble.

1. **Back up your important files.** Copy documents, photos and anything irreplaceable to an external drive or cloud storage before you start changing settings. Our [file recovery guide](/posts/how-to-recover-deleted-files/) explains how to rescue data from a drive that is already misbehaving, and our home office guide covers desk placement.
2. **Plug in the power adapter.** Windows throttles performance on battery by default, and you do not want an update or a disk operation interrupted at 5 percent.
3. **Note your current speed.** Time how long your laptop takes to boot to a usable desktop, and how long your browser takes to open. You want a before-and-after number so you know which steps actually helped.

Also check that Windows itself is fully updated: **Settings → Windows Update → Check for updates**. A machine stuck on a pending update can behave as if it were broken.

## The 15 Fixes, in Order

### 1. Cut the startup programs

This is the highest-return fix on the list. Press **Ctrl + Shift + Esc** to open Task Manager, click the **Startup** tab, and review every entry. Disable anything you do not need the moment the laptop boots - chat apps, game launchers, vendor "assistants", updaters that will still update when you open them. Keep only what you genuinely need at login: your security software, touchpad or graphics drivers, and perhaps your cloud storage if you rely on it.

In Windows 11 you can also go to **Settings → Apps → Startup** for the same list with impact ratings. If an item is marked **High impact**, it is slowing your boot measurably.

macOS equivalent: **System Settings → General → Login Items**, and remove anything unnecessary from both "Open at Login" and "Allow in the Background".

Reboot afterwards and check your timing. On many machines this single step cuts boot time in half.

### 2. Uninstall software you no longer use

Open **Settings → Apps → Installed apps**, sort by size or install date, and remove programs you have not opened in months. Old games, trial office suites, duplicate PDF tools, vendor utilities that came with the laptop - all of them leave background services behind.

Do not uninstall anything whose name you do not recognise until you have searched for it: some system components have obscure names. When in doubt, leave it and move on. The goal is to remove software you deliberately installed and no longer want, not to gut the system.

### 3. Free space on the system drive

Check your free space: open File Explorer and look at the **C:** drive. If you are below 15 GB free, clean up before anything else.

Run **Disk Cleanup**: type "Disk Cleanup" in the Start menu, select the C: drive, tick **Temporary files**, **Update cleanup** and **Thumbnails**, and confirm. Windows Update cleanup alone frequently returns 5 - 20 GB. Then open **Settings → System → Storage** and use the recommendations to clear Downloads, old game files and restore points you do not need.

Cloud-storage users: empty the local recycle bin too. A full recycle bin is still occupying the drive.

### 4. Update Windows, drivers and your browser

Return to **Settings → Windows Update** and install everything pending, then restart. Outdated chipset and storage drivers can cost real performance because the fix for a slow disk bug often ships in a driver update.

Next, update your browser: **Menu → Help → About Google Chrome** (or equivalent). Browsers are where you spend most of your time, and each release includes speed work. Finally, let your antivirus run a full update and a quick scan so you are not running against yesterday's definitions.

### 5. Check for malware and unwanted software

Run a full scan with Windows Security (**Settings → Privacy & security → Windows Security → Virus & threat protection → Full scan**). For a second opinion, run a one-off scan with a reputable on-demand scanner.

Then audit your browser extensions. Remove any toolbar, "coupon finder" or search modifier you did not intentionally install, and reset your browser's search engine if it has been changed. Browser hijackers are the most common cause of a laptop that feels slow *only when browsing*.

### 6. Change the power plan to Maximum Performance

Windows ships with a power saver plan that caps the processor to save battery. On a laptop that stays plugged in, that cap is pure lost speed.

- **Windows 11:** Settings → System → Power & battery → Power mode → **Balanced** or **Best performance**
- **Windows 10:** Control Panel → Power Options → select **High performance** (or click "Show additional plans")

For a plugged-in desktop replacement, High performance is appropriate. For a laptop you carry between meetings, Balanced is the better compromise; switch only when you need the extra snap.

### 7. Turn off heavy visual effects

Windows decorates every window with animations that cost frames on integrated graphics. Type "Adjust the appearance and performance of Windows" in the Start menu, choose **Adjust for best performance**, or hand-pick: keep "Smooth edges of screen fonts" and "Show thumbnails rather than icons", disable the rest. Your laptop will feel snappier immediately, especially when opening menus or dragging windows.

### 8. Reduce browser clutter

A browser with 40 open tabs is a memory-eating program in its own right. Close tabs you are finished with, and use a **Tab Suspender**-style extension or your browser's built-in tab sleeping (Chrome's Memory Saver, Edge's Sleeping Tabs) to pause background tabs.

Also disable autoplay video in social feeds, and consider blocking heavy ad scripts with a content blocker if you are comfortable doing so. This step pairs naturally with [organising your digital files](/posts/another useful guide) - a tidy browser and a tidy downloads folder tend to travel together.

### 9. Add virtual memory (page file) if RAM is tight

If your laptop has 4 GB of RAM, make sure Windows is allowed to use disk as overflow. Search for "View advanced system settings", open **Performance → Settings → Advanced → Virtual memory**, and let Windows manage the page file automatically on the fastest drive. Manually shrinking the page file to a fixed small size is a performance myth that causes stutters and crashes.

### 10. Upgrade the hardware that actually matters

If the software fixes helped but the laptop still feels limited, buy the upgrade that matches the bottleneck:

- **RAM at 4 GB → 8 or 16 GB.** The biggest day-to-day improvement for multitaskers. Check your model's maximum on the manufacturer's site; many ultrabooks have the RAM soldered and cannot be upgraded.
- **HDD → SSD.** If your machine still has a spinning hard drive, an SSD is transformative: boot times drop from minutes to seconds and application launches feel instant. Check whether yours uses a 2.5-inch SATA or an M.2 NVMe drive before ordering.
- **Already have an SSD and 8 GB or more?** Then the limit is likely the processor or your workload - skip to step 12 and 13.

### 11. Reclaim disk space from heavy applications

Large applications keep caches and old versions. Games keep gigabytes of patches; video editors keep preview files. Check **Settings → Apps → Installed apps** sorted by size, and inside big apps look for "clear cache" or "empty preview files" options. Your browser's cache can also be cleared from its settings menu - a surprisingly effective fix for a browser that has become sluggish.

### 12. Check whether the drive is failing

A failing drive does not just hold less data; it forces the system to retry reads, causing multi-second freezes. Press **Start**, type "Windows PowerShell", run it as administrator, and enter:

`Get-PhysicalDisk | Select FriendlyName, MediaType, HealthStatus, Size`

A HealthStatus of **Warning** or **Unhealthy** means back up immediately and replace the drive. Also open the manufacturer's utility (Samsung Magician, Crucial Storage Executive, WD Dashboard) or use CrystalDiskInfo for detailed SMART data. If the drive is healthy, cross "hardware" off your list and continue.

### 13. Stop the resource hogs

Back in Task Manager's **Processes** tab, sort by CPU and then by Memory. Look for anything sitting at high usage while you are idle - a stuck update service, a sync client looping, a search indexer trapped in a cycle. Right-click and **End task** on what you can identify, then check whether it returns after a reboot. If one process keeps coming back, search its name plus "high CPU" to identify it.

Do not end system processes you do not recognise; ending the wrong one can corrupt open files.

### 14. Defragment (HDD) or trim (SSD)

For a **mechanical drive**, run "Defragment and Optimise Drives" monthly: fragmented files force the head to jump around. For an **SSD**, never defragment in the traditional sense - instead use the **Optimise** button, which runs TRIM and tells the drive which blocks are free. Windows usually schedules this automatically; verify it is enabled.

### 15. Refresh or reset Windows as the last resort

If you have tried everything and the machine is still miserable, Windows offers a middle path before a full wipe: **Settings → System → Recovery → Reset this PC → Keep my files**. This reinstalls Windows while preserving your documents, and removes the years of registry residue and broken updates that accumulate invisibly. Back up first anyway - it is cheap insurance.

A full factory reset (Remove everything) is the nuclear option. Only reach for it when the laptop is genuinely yours to rebuild, and you have your licences, installers and data backed up.

## Troubleshooting: When a Fix Does Not Help

**The laptop was fast yesterday and is slow today.** Something changed recently. Think about what you installed, which update arrived, or whether a drive is nearly full. Use Task Manager to see what is running - the answer is usually visible in the first tab.

**It is slow only on battery.** That is Windows' power plan doing its job. Change the power mode as in step 6, or accept some slowdown to preserve runtime.

**It is slow only when browsing.** Focus on step 5 and step 8: extensions, hijacked search settings, and a pile of open tabs.

**It freezes for seconds, then recovers.** Classic failing-drive behaviour. Run the health check in step 12 before anything else and back up your data.

**Fans roar constantly.** That is heat, and heat means throttling. Shut down, unplug, and clean the vents with short bursts of compressed air. A laptop cooling pad and a hard surface (not a blanket) help; see our [home office setup guide](/posts/a home office setup) for desk placement basics.

## A 10-Minute Monthly Maintenance Routine

Prevention is cheaper than repair. Once a month:

1. Check free disk space and empty the recycle bin.
2. Install pending Windows and browser updates.
3. Review Task Manager's Startup tab for new additions.
4. Restart the laptop (not just shut down - modern Windows fast-starts and skips deep maintenance).
5. Glance at drive health if anything feels off.

That routine keeps the accumulation of startup creep, updates and temp files from ever rebuilding the problem you just fixed.

## When to Get Professional Help

Call a technician - or consider replacement - when the health check reports a failing drive and you cannot restore a backup, when the laptop overheats immediately after cleaning (a sign of failed thermal paste or a dead fan), or when the motherboard itself is failing. A machine from 2015 with a mechanical drive and 4 GB of RAM can be made usable again, but at some point the honest answer is that a new entry-level laptop costs less than the repair.

Before you decide, read our guide to [building or buying the right computer](/posts/the right computer for you) - sometimes a $200 upgrade path exists that makes the old machine viable for years.

## The Bottom Line

Speed is not one setting; it is a backlog being cleared. Start with startup programs, disk space and updates - they account for most cases and cost nothing. Add malware scanning and power settings next, then consider hardware only if the software housekeeping has done its job. Do the steps in order, keep notes on what changed, and your laptop will feel like itself again. Then set a monthly reminder for the ten-minute routine, and you will not have to read this guide twice.
