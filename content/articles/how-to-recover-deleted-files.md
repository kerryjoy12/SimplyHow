---
title: How to Recover Deleted Files from a Computer or Phone
slug: how-to-recover-deleted-files
description: Get deleted files back - from the recycle bin, cloud trash, backups and recovery software - with a clear action order that protects your data first.
keywords: recover deleted files, restore deleted photos, file recovery software, how to undelete files, recover files after emptying recycle bin
category: technology
tags: data recovery, backup, Windows, Mac, troubleshooting
author: The SimplyHow Editorial Team
date: 2026-09-07
updated: 2026-09-07
faqs:
  - q: Can I recover files after emptying the recycle bin?
    a: Often, yes - as long as you stop using the drive immediately. Deleted files remain on the disk until overwritten by new data, so use the drive as little as possible and run reputable recovery software such as Recuva, PhotoRec or Disk Drill to scan for them. The sooner you act, the better the odds.
  - q: Are free file recovery tools safe?
    a: The reputable ones are safe when you install them to a different drive than the one you are recovering from. Avoid tools that demand payment to reveal found files, tools from unknown download sites, and anything that asks you to save recovered data back onto the same damaged drive - that overwrites what you are trying to rescue.
  - q: How long do deleted files stay recoverable?
    a: There is no fixed timer - it depends on how much new data is written to the drive. On an idle drive, deleted files can persist for months; on a drive in active use they may be overwritten within hours. This is why the first rule of recovery is to stop using the affected device.
  - q: Can a formatted drive be recovered?
    a: Usually yes for a quick format, because it mostly clears the file table rather than the data itself. A full format or secure erase writes over everything, leaving almost nothing to recover. SSDs complicate this further because the TRIM command actively clears deleted data - recovery odds on modern SSDs are lower than on hard drives.
  - q: What if the drive is clicking or won't be recognized?
    a: Stop immediately and do not keep powering it on. A clicking drive has a mechanical failure, and every attempt shortens the window for professional recovery. Power it off, keep it physically still, and contact a data recovery lab - software cannot fix hardware failure.
---

Losing a file feels like a small emergency: the dissertation draft, the tax receipt, the photos from the trip. The instinct is to start clicking - reinstall, rescan, try another program - but the single most important rule of file recovery is the opposite: **stop touching the drive**. Everything deleted is a race between you and the new data that will overwrite it.

This guide follows the order that gives you the best chance of getting files back, starting with the places nobody checks (trash, cloud history, backups) and only then moving to recovery software. It also covers the cases where software cannot help - clicking drives, formatted phones, failed SSDs - and what to do instead.

**The recovery action plan, in one line: stop using the device, check the easy places first, then run one proper recovery scan, and only escalate if that fails.** Work through the sections below in order; each one takes minutes and costs nothing until you reach the software stage.

## First 60 Seconds: Protect What Is Left

Do these immediately, before anything else:

1. **Stop writing to the affected drive.** Do not install software onto it, do not download files to it, do not keep browsing from it. Every byte written may land on top of your deleted file.
2. **If it is a computer drive, work from another device** - your phone, a different computer, or a USB stick plugged elsewhere - to download recovery software.
3. **If the drive is external, disconnect it** until you are ready to scan.
4. **Do not reformat, do not "repair disk", do not run chkdsk** (or its Mac equivalent) before recovery. Disk-repair tools reorganise the drive and can destroy the very file structures recovery depends on.

If the file is critical and the drive is making unusual noises, skip the software entirely and go straight to [When Software Cannot Help](#when-software-cannot-help) at the end.

## Check the Easy Places First (5 Minutes)

Most "lost" files are not deleted at all - they are misplaced, overwritten in a different location, or recoverable from a history feature.

### 1. The Recycle Bin or Trash

Windows: open the Recycle Bin on the desktop, search for the file name, right-click → **Restore**. Mac: open the Trash in the Dock and drag the item back, or right-click → Put Back.

Emptying the bin does not make recovery impossible - it only moves the file into the "needs software" category - but check the bin first because restoration there is instant.

### 2. Cloud storage history

Cloud services keep versions you may not know about:

- **Google Drive:** right-click the file → **Version history → See version history**; restore any earlier version. Recently deleted files sit in Trash for 30 days.
- **OneDrive:** right-click → **Version history**; and check OneDrive.com → Recycle bin.
- **Dropbox:** the web interface keeps **version history** (30 days, longer on paid plans) and a deleted-files bin.
- **iCloud:** icloud.com → **Data Recovery** (40 days) for documents, and Photos → Recently Deleted for images.

### 3. Auto-save and document history

Word, Excel and PowerPoint keep auto-recover files: open the app, go to **File → Info → Manage Document / Manage Workbook → Recover Unsaved Documents**. Google Docs keeps full revision history under **File → Version history**. Code editors, photo apps and note-taking apps usually have their own local version history too.

### 4. Photo-specific recovery

Photos have extra lifelines: your phone's **Recently Deleted** folder (30-40 days on both Android and iPhone), Google Photos or iCloud Photos trash if the image was ever backed up, and your camera's own recovery folder on SD cards - check the card's menu for "recover" or "protected images" before formatting anything.

## Restore from Backups

If a backup exists, recovery becomes restoration - always preferable to scanning.

**Windows File History:** Settings → Update & Security → Backup → **More options → Restore files from a current backup**. Browse the timeline, select the file or folder, and press the green restore button.

**macOS Time Machine:** click the Time Machine icon in the menu bar → **Enter Time Machine**, then use the timeline on the right to travel back to when the file existed and click **Restore**.

**Phone backups:** restore a whole device from your [iPhone backup](/posts/how-to-back-up-your-iphone/) or Android cloud backup if entire photo libraries or message histories went missing. This is heavier-handed than file recovery but reliable when the loss is large.

**System restore points / previous versions:** on Windows, right-click the containing folder → **Properties → Previous Versions**. Windows creates these automatically at intervals, and they often hold a folder you accidentally overwrote.

**The habit this teaches:** if you have restored from a backup today, schedule the backup routine described in our [backup guide](/posts/how-to-back-up-your-iphone/) before you close this page. Loss is usually discovered late; backups are the only thing that makes "late" survivable.

## Run Recovery Software

If the easy places failed, it is time to scan the drive. This works on the principle that deleted files remain as unindexed data until overwritten.

### Choosing a tool

Use established software with a clear reputation:

- **Recuva** (Windows, free tier) - simple, fast, good for documents and photos
- **PhotoRec / TestDisk** (Windows, Mac, Linux, free, open source) - thorough, less polished, recovers from damaged partitions
- **Disk Drill** and **R-Studio** - stronger paid options with better previews and network-drive support
- **PhotoRec** also handles memory cards from cameras well

Avoid anything downloaded from aggregator sites, anything with "cracked" versions, and tools that scan for free but demand payment before showing which files were found without stating the price upfront.

### Installing correctly

**Install the software to a different drive than the one you are recovering.** If you are recovering the C: drive, install to a USB stick or an external disk. Installing to the affected drive writes data over deleted files - the exact thing you are trying to prevent.

### Scanning

1. Launch the tool and select the drive, card or partition.
2. Start with a **quick or default scan**; if results are thin, follow with a **deep scan** (slower, finds files whose metadata is gone).
3. Let it finish. Deep scans on large drives can take hours - interrupting restarts the process.
4. Use the tool's **preview** where available to confirm a file is intact before restoring.

### Restoring safely

Save recovered files **to a different drive** - never back onto the source. Recover to external storage, another internal drive, or cloud storage. If you must recover to the same drive (a last resort), recover in small batches and verify each one opens.

Check the most important files immediately: open documents, play a few seconds of each video, view photos at full size. A file that recovered but will not open is partially overwritten; stop the scan and escalate if the most critical files are damaged.

## Device-Specific Routes

### Windows and Mac

Everything above applies. On Mac, also check **File → Revert To** in many apps, and remember macOS Time Machine needs an external drive to have been connected. On Windows, enable File History (**Settings → Update & Security → Backup**) so the safety net exists for next time.

### Android

- Check **Google Photos → Library → Trash** and your gallery app's trash (30-60 days).
- Files by Google → Browse → check any "Recently deleted" section.
- If photos were synced to Google Drive or Samsung Cloud, restore from there.
- For WhatsApp media specifically, follow our [WhatsApp transfer guide](/posts/how-to-transfer-whatsapp-chats-to-a-new-phone/) - media in chats often survives device changes via cloud backup.

### iPhone

- **Photos → Recently Deleted** (40 days).
- Restore from an [iCloud or computer backup](/posts/how-to-back-up-your-iphone/) if whole libraries are missing.
- Files app → Browse → Recently deleted for documents.
- iCloud.com → Data Recovery for documents and notes.

### SD cards and USB sticks

Remove the card, connect it to a computer, and run a recovery scan from a different drive. Cards that show 0 bytes or prompt to format: **do not format**, run TestDisk/PhotoRec directly against the card, and copy recovered files elsewhere immediately.

## When Software Cannot Help

Some failures are physical, and no download fixes them.

**A clicking, grinding or beeping hard drive** has mechanical damage. Each power-on attempt can worsen it. Power the drive off, do not freeze it in the freezer (an old myth that risks condensation), and contact a professional data recovery lab. Expect quotes in the hundreds to thousands of dollars depending on damage; ask whether they charge if recovery fails.

**A drive that is not recognized at all** may have electronics failure - again, hardware territory. Try a different cable and port once, then stop.

**A modern SSD that was formatted or TRIMmed** has likely had its deleted blocks actively erased by the drive itself. Software recovery odds on SSDs are much lower than on hard drives; if the data is critical and TRIM has run, professional recovery may still be possible but is not guaranteed. This is precisely why SSD users need cloud or external backups more than anyone - see our [slow laptop guide's](/posts/how-to-speed-up-a-slow-laptop/) drive-health check for how to monitor drive condition before failure.

**Water or fire damage.** Power the device off and do not attempt to dry it with heat or rice. Specialised labs can sometimes recover from liquid-damaged phones and drives; acting quickly improves odds.

**The file opens but is corrupted** after recovery: partial overwrite. Try recovering from a backup instead, or use file-repair tools for specific formats (photo JPEG repair, video repair) - these have modest but real success rates.

## Recovering Your Time: Prevention Pays

The cheapest recovery is the one you never need. Three habits eliminate most file-loss events:

1. **The 3-2-1 rule, simplified:** three copies of important data, on two different media, with one off-site. For most people that means: the original on your computer, automatic cloud sync (Google Drive, OneDrive, iCloud or Dropbox), and periodic backups to an external drive.
2. **Automatic photo backup** on every phone - Google Photos or iCloud, verified monthly by opening the app and checking the backup status.
3. **Versioned cloud storage for documents you edit** - write files in cloud-synced folders, and use the version history described in the easy-places section as your undo button across weeks rather than seconds.

Set the first two up today: enable phone photo backup, and connect an external drive for your computer's automatic backup. It takes ten minutes and converts every future "deleted file" from an emergency into a two-minute restore.

## The Bottom Line

File recovery is a race against overwriting, so the sequence matters more than the tool: stop using the drive, check trash folders and cloud history, restore from backups, then run one careful recovery scan to a different destination. Most people who follow that order recover their files; most people who panic and keep using the drive do not. When the hardware itself is failing, professional labs are the answer - and when everything is restored, the backup routine is what keeps it a non-event next time.
