---
title: How to Factory Reset a Laptop (Windows & Mac, With Backups)
slug: how-to-factory-reset-a-laptop
description: Factory reset your laptop safely - full backup checklist, Windows 10/11 and macOS reset steps, reinstall tips and what to do afterwards.
keywords: factory reset laptop, reset Windows 10 to factory settings, wipe MacBook, restore laptop to factory settings, sell laptop reset
category: technology
tags: Windows, Mac, reset, troubleshooting, backup
author: The SimplyHow Editorial Team
date: 2026-07-27
updated: 2026-07-27
faqs:
  - q: Does a factory reset delete everything on a laptop?
    a: Yes - a full factory reset removes your files, apps, accounts and settings, returning Windows or macOS to the state it shipped in. That is the point when selling or troubleshooting, but it means you must back up documents, photos, browser data and licence keys first, because recovery afterwards depends entirely on what you saved.
  - q: How long does a laptop factory reset take?
    a: Plan for 30 minutes to 2 hours on a modern laptop with an SSD, and longer on an old mechanical drive or if the reset reinstalls Windows from the internet. First boot afterwards adds another 15 to 30 minutes of updates and setup before the machine is genuinely usable.
  - q: Can I factory reset a laptop without a password?
    a: Usually yes - Windows offers Reset from the sign-in screen (choose I forgot my password or use the recovery options) and advanced startup; macOS allows erasure from Recovery mode with your Apple ID or an administrator account. Full-disk encryption means someone with neither account access nor your key cannot reset and reuse the machine with your data intact.
  - q: Should I remove my Microsoft account before selling my laptop?
    a: You do not strictly need to - removing local accounts and performing a full erase during handover covers it - but signing out of OneDrive, Office and removing the device from your Microsoft account's device list is good hygiene. On Macs, sign out of iCloud and deauthorise the Mac before wiping, otherwise Activation Lock can block the new owner.
  - q: Will a factory reset fix a slow or broken laptop?
    a: Often, when the cause is accumulated software cruft, broken updates or unwanted programs. But try the lighter fixes first - cleanup, malware scan and drive checks in our speed guide - because a reset discards your setup and still will not fix failing hardware, overheating or a dying drive.
---

A factory reset is the cleanest line you can draw in a computer's life: on one side, years of accumulated software, broken settings and forgotten files; on the other, a machine that behaves the way it did the day you unboxed it. It solves stubborn performance problems, removes malware that will not leave, and prepares a laptop for its next owner without leaking your data.

It is also one of the few operations that deletes everything if you skip preparation. This guide takes the careful route: what to back up (including the things people always forget), how to reset **Windows 10 and 11** and **macOS**, what to reinstall afterwards, and how to wipe a machine you are selling or giving away.

You need your laptop plugged into power throughout, about two hours of mostly unattended time, and a backup destination - external drive or cloud storage. No technical skill beyond following instructions in order.

## What to Back Up Before You Reset

Treat this list as mandatory. Every item has cost someone their data in our experience.

1. **Documents, photos, videos, music** - copy them to an external drive or confirm cloud sync shows "complete" for everything.
2. **Browser bookmarks and passwords** - sign into your browser's sync, or export bookmarks as HTML. Passwords saved only in the browser vanish with the reset.
3. **Desktop and Downloads folders** - the two most overlooked locations; walk through them file by file.
4. **App licence keys and installers** - note paid software serial numbers (check your email purchase history and the vendor's account page), and download the installers you will need.
5. **Email** - webmail survives; desktop clients store local mailboxes that do not. Export PST/DBX files if you use Outlook or Apple Mail locally.
6. **Two-factor authentication recovery codes** - authenticator apps on the laptop or browser-based 2FA die with the reset. Save recovery codes for every account now.
7. **Wi-Fi passwords you will need** - check the router's sticker or your password manager.
8. **QuickBooks, Photoshop presets, game saves, SSH keys, code repositories** - application-specific data is rarely backed up automatically. Game launchers with cloud saves (Steam) are fine; local-only saves are not.
9. **OneDrive/Google Drive sync status** - confirm everything you think is in the cloud actually is; a sync icon still spinning means it is not.

Our [file recovery guide](/posts/how-to-recover-deleted-files/) covers how to salvage data from a machine that is already failing - if the laptop is dying, back up **before** attempting any reset.

## Decide Which Reset You Actually Want

**Keep my files** (Windows) or **Erase All Content and Settings** with data intact: removes apps and settings but keeps personal files. Good for troubleshooting without losing documents.

**Remove everything** (Windows) or **Erase All Content and Settings** (macOS): the true factory reset. Use this for selling, gifting, malware or a genuinely fresh start.

**Clean reinstall from USB:** the most thorough option - you create installation media, wipe the drive completely and install the OS fresh. Choose it when selling a machine with sensitive data (full drive encryption makes it less critical) or when the built-in reset fails.

Also decide about **drive wiping standards**: for personal resale, a full-format reset is adequate; for business data, use the OS's secure-erase options or manufacturer tools.

## Resetting Windows 11

### Back up, then open Settings

**Settings → System → Recovery → Reset this PC → Reset PC**. Choose:

- **Keep my files** - apps and settings removed, documents kept (cloud-synced files may reappear from OneDrive).
- **Remove everything** - total wipe. For a machine you are selling, click **Change settings** and enable **Clean data** (slower, more thorough overwrite).

### Choose how to reinstall

- **Cloud download** - downloads a fresh Windows image (~4 GB). Best result, needs good internet.
- **Local reinstall** - reuses the image already on the machine. Faster, but carries over corruption if the existing install is damaged.

Prefer **Cloud download** whenever the connection allows; it is the closest thing to true "factory" state.

### Let it run

The laptop restarts several times and shows progress for 30 minutes to 2 hours. Keep it plugged in and do not interrupt - power loss mid-reset can leave an unbootable machine. When the out-of-box setup screen appears, you are done: create your account, run **Windows Update** fully, reinstall essential apps, and restore your files from backup.

## Resetting Windows 10

The flow is nearly identical: **Settings → Update & Security → Recovery → Reset this PC → Get started**. Windows 10 also offers **Restore from cloud or local**, the same two options as above.

For machines that cannot boot into Windows: power on, and when the logo appears hold power until it shuts off - repeat three times to trigger **Automatic Repair → Advanced options → Reset this PC**. The same choices appear from there.

Business and Pro users may also see **Fresh start** under Device performance and health, which reinstalls Windows while keeping some files - inspect what it promises before choosing it.

## Resetting a Mac

Apple's flow depends on your chip and macOS version.

### Apple silicon (M1/M2/M3/M4) or T2 Macs

1. **Sign out** of iCloud (System Settings → your name → Sign Out), iMessage, and any other services. Deauthorize music/apps where applicable.
2. Restart and hold the **power button** until "Loading startup options" appears → **Options → Continue** to enter Recovery.
3. Choose **Erase All Content and Settings** (the simplest path on modern macOS: it removes data, signs out and deactivates) - or, for a deeper wipe, open **Disk Utility**, erase **Macintosh HD** (scheme: APFS), quit Disk Utility and choose **Reinstall macOS**.
4. Confirm, then let the Mac erase and restart to the hello screen.

### Intel Macs without T2

Restart and hold **Command + R** until the Apple logo appears. Then: Disk Utility → erase the drive (APFS on SSDs, Mac OS Extended on older drives) → quit → **Reinstall macOS**.

**Activation Lock note:** erasing without signing out of iCloud can lock the Mac to your Apple ID. The new owner will be blocked at setup. Sign out first, every time.

## The Thorough Clean Reinstall (Any OS)

When you want certainty - especially before selling:

1. **Create installation media:** Microsoft's **Media Creation Tool** (Windows) or Apple's bootable installer (macOS) on an 8-16 GB USB stick.
2. **Boot from it:** hold the boot key (F12/F2/Option/Escape - varies) during startup and select the USB drive.
3. **Wipe the internal drive** in the installer (delete every partition, then let the installer recreate them).
4. **Install the OS fresh,** then update fully and reinstall apps one by one.

A clean reinstall takes longer but avoids carrying over any residual state, which matters most when the machine changes hands.

## After the Reset: The Rebuild Checklist

A resetted laptop is unfinished until you:

1. **Run Windows Update / Software Update to completion** - twice, until no updates remain. Graphics and chipset drivers usually arrive here.
2. **Reinstall your apps** - start with the browser and password manager, then restore bookmarks and passwords by signing into sync. Use your licence notes from the backup stage.
3. **Restore files** - copy documents and photos back (or confirm cloud sync completed), then verify the important ones open.
4. **Reconnect peripherals and printers** - see our [wireless printer guide](/posts/how-to-connect-a-wireless-printer/) if yours was reset too.
5. **Re-enable security:** BitLocker/FileVault if you use it, your antivirus, and two-factor authentication apps with their recovery codes stored safely.
6. **Set restore points or backups immediately** - Windows: create a restore point; both platforms: turn on automatic backups before you forget. Our [backup routine](/posts/how-to-back-up-your-iphone/) applies to computers with trivial changes.
7. **Reconfigure power and display settings** - plugging in a second screen follows our [dual monitor guide](/posts/how-to-set-up-dual-monitors/) if you use one.

Budget an evening for the full rebuild; the reset itself is the quick part.

## When a Reset Fails

**"There was a problem resetting your PC."** Boot to advanced startup (hold Shift while clicking Restart, or use the power-button trick), choose **Reset** from there, and prefer Cloud download. If it still fails, use the USB clean reinstall path - built-in reset depends on files on the same drive that may be damaged.

**Stuck at a percentage for hours.** Give a genuine hour on a slow drive; beyond that, force power off and retry via advanced startup or USB media.

**Mac stuck downloading macOS Recovery.** Internet connection issues are the usual cause - use a wired or known-good network, or create a bootable USB installer on another Mac.

**Drive not detected during reinstall.** A failing drive, a RAID/Intel RST configuration the installer cannot see, or a missing storage driver. Run hardware diagnostics (hold D at boot on Macs; manufacturer key on PCs). If the drive is failing, see the drive-health section of our [speed guide](/posts/how-to-speed-up-a-slow-laptop/) - replace it rather than reinstalling onto it.

**Reset succeeded but the laptop is still slow.** The bottleneck is then hardware: a mechanical drive (upgrade to SSD), insufficient RAM, or overheating. Software cannot fix those - check the [hardware upgrade path](/posts/how-to-back-up-your-iphone/) before replacing the whole machine.

## Selling or Donating the Machine

Beyond the reset itself:

- **Sign out everywhere first:** iCloud (and turn off Activation Lock), your Microsoft account, Google, Chrome/Firefox sync, Dropbox, Steam - the full list of anything account-bound.
- **Deauthorize** iTunes/Media apps and any DRM-protected content stores; you usually have a limited number of authorisations.
- **Remove the device** from your Microsoft, Google and Apple account device lists afterwards.
- **Pull the old drive's data** if you are also swapping drives; keep the drive if it ever held sensitive information.
- **Do a final boot check** after reset: create a temporary account, confirm no trace of your files, accounts or Wi-Fi history remains, then shut down for handover.

If the machine had BitLocker or FileVault enabled, the reset removes the key along with the data; on SSDs with hardware encryption, additionally performing a **secure erase** through the drive manufacturer's tool completes the job for paranoid-level requirements.

## The Bottom Line

A factory reset is a controlled demolition of software state: back up the things automatic backups miss (licences, browser passwords, 2FA codes, desktop files), choose the right reset type, prefer cloud downloads over local images, and treat the reset as the midpoint rather than the end - rebuilding apps, updates and backups completes the job. Done carefully, a reset turns a laptop you distrust into one you keep, or one you hand over without a second thought.
