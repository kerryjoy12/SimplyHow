---
title: How to Connect a Wireless Printer (Wi-Fi, Windows, Mac, Phone)
slug: how-to-connect-a-wireless-printer
description: Get any printer on Wi-Fi - WPS, manual network setup and step-by-step connection for Windows, Mac, iPhone and Android, plus print-fix troubleshooting.
keywords: connect wireless printer, add printer to WiFi, printer not printing, add printer Windows 11, print from iPhone Android
category: technology
tags: printer, Wi-Fi, Windows, Mac, troubleshooting
author: The SimplyHow Editorial Team
date: 2026-07-20
updated: 2026-07-20
faqs:
  - q: Why won't my wireless printer connect to Wi-Fi?
    a: The most common causes are connecting the printer to the 5 GHz band it does not support, entering the wrong password, or being too far from the router. Use the 2.4 GHz network, type the password carefully using the printer's own control panel, and move the printer temporarily next to the router while pairing, then test it back in place.
  - q: How do I add a printer to Windows 11?
    a: Open Settings → Bluetooth & devices → Printers & scanners → Add device; Windows discovers network printers automatically. Select yours, click Add device, and Windows installs drivers. If it does not appear, run the printer's own setup app from its support site instead - it installs both the driver and the network configuration in one pass.
  - q: How do I print from my phone?
    a: On iPhone or iPad, open the app's share sheet and choose Print (AirPrint works with most printers automatically). On Android, use the Mopria Print Service or the printer manufacturer's app. Ensure the phone and printer are on the same Wi-Fi network first - they cannot see each other otherwise.
  - q: Do I need a computer to use a wireless printer?
    a: No. Once on Wi-Fi, printers work directly from phones and tablets through AirPrint or the manufacturer's app, and many printers also print by email, from USB sticks, or through cloud services. The computer is optional for setup and advanced options like custom paper sizes.
  - q: Why does my printer keep going offline?
    a: Usually an IP address change (the router reassigned the printer's address after a reboot) or a dropped Wi-Fi connection. Fix it permanently by assigning the printer a static IP address in the router's DHCP settings, or use the printer's hostname rather than an IP when adding it in Windows or macOS.
---

Printing is the one part of computing that still refuses to be invisible: a wireless printer must join your network, every device must find it, and the whole arrangement must keep working after your router restarts. The good news is that modern printers make this straightforward - and every problem people hit has a small, known cause.

This guide covers the physical and network setup first (getting the printer onto Wi-Fi), then connection on each platform: **Windows, macOS, iPhone and Android**, plus shared and guest scenarios. It ends with fixes for the two perennial complaints - "printer offline" and "printer not printing" - and the one permanent configuration that stops the offline problem from returning.

You need the printer, its power cable, your Wi-Fi name and password, and about 20 minutes. A phone or computer connected to the same network is helpful for setup.

## Before You Start: Gather Three Things

1. **Your Wi-Fi name (SSID) and password.** The printer will ask for both, typed with the printer's own buttons or touchscreen. Find them on the router's sticker or in your password manager before starting - hunting for a password halfway through setup is what makes people quit.
2. **The printer's model number** - on the front, top or back label. You may need it to download the right driver or app.
3. **Position near the router for setup.** Signal strength matters during pairing; you can move the printer afterwards if the connection holds.

Also unbox completely: remove all tape, packaging and protective film from inside the trays and cartridge area, install the cartridges, and run the printer's own startup sequence (most print an alignment or quality page automatically). Wireless setup before ink installation often fails on mid-range models.

## Method 1: WPS (The 30-Second Option)

If both your router and printer have a **WPS button** (Wi-Fi Protected Setup - usually marked with the arrows logo), this is the fastest path:

1. Press the **WPS button on the router** - you have about two minutes.
2. On the printer, open the **Wireless** or **Network** settings menu and choose **WPS push button** (some printers have a dedicated physical button).
3. Wait for the wireless light to stop blinking and stay solid.

WPS pairs the devices without typing the password. Two caveats: WPS has been deprecated on some newer routers for security reasons, and WPS connects to one band (usually 2.4 GHz, which is what printers want anyway).

**WPS PIN alternative:** if your printer only shows a PIN, enter that PIN in the router's WPS administration page instead.

## Method 2: Printer Control Panel (Most Reliable)

Works on any printer with a screen or button menu:

1. On the printer, open **Setup / Settings → Network → Wireless Setup Wizard**.
2. It scans and lists nearby networks. Select **your 2.4 GHz network** - if you see two names (one ending in `-5G`), pick the non-5G one; most printers only support 2.4 GHz.
3. Type the Wi-Fi password carefully with the printer's keypad. Case matters; use the panel's toggle for symbols.
4. Confirm and wait for the success message or solid wireless light.

If your network name does not appear, the printer may be too far from the router - temporarily move it within a couple of metres, pair, then relocate it.

## Method 3: Manufacturer's Setup App

Canon PRINT, Epson Smart Premium, HP Smart, Brother iPrint&Scan - each vendor's app walks through pairing and installs drivers on your phone at the same time. Download the official app (from the App Store, Play Store, or the exact link printed in the printer's manual - not from ads). The app typically:

- Finds the printer automatically over Bluetooth
- Feeds it your Wi-Fi credentials from the phone
- Adds the printer to your phone for mobile printing
- Installs any needed drivers

This is often the smoothest path for modern printers, and it sets up your phone simultaneously.

## Method 4: Ethernet (The Fixed Option)

If your printer has an **Ethernet port** and you can run a cable to the router: plug it in, and the printer usually configures itself via DHCP. Ethernet never drops, never changes bands, and never suffers interference - if the printer lives near the router, prefer it. Skip wireless pairing entirely; the printer is already on the network.

## Connect on Windows 11 and 10

1. Open **Settings → Bluetooth & devices → Printers & scanners → Add device** (Windows 10: Devices → Printers & scanners → Add a printer or scanner).
2. Wait for discovery - Windows finds network printers automatically.
3. Select yours → **Add device**. Windows installs the driver (Windows Update supplies most; a "Getting driver from Windows Update" message is normal).
4. If it never appears: click **The printer that I want isn't listed** → **Add a printer by TCP/IP address or hostname**, then enter the printer's hostname (like `EPSON-ABC123`) or IP (find it on the printer's network info page).
5. **Print a test page** from the printer's properties dialog to confirm.

If Windows fails entirely, run the manufacturer's Windows setup program - it installs the full driver suite including scanning, which basic Windows drivers sometimes lack.

## Connect on macOS

1. Open **Apple menu → System Settings → Printers & Scanners**.
2. Click the **+** button; your printer should appear in the default list (macOS discovers AirPrint printers instantly).
3. Select it and click **Add**. macOS picks a driver or AirPrint automatically.
4. If missing: choose **IP** tab and enter the printer's hostname, or download the manufacturer's Mac driver package.

macOS supports AirPrint natively for printing and scanning (via the Image Capture app or vendor software). Note that some vendor features - advanced photo settings, utilities - require installing their Mac software separately.

## Print from iPhone and iPad (AirPrint)

AirPrint needs no app and no driver:

1. Ensure the iPhone is on the **same Wi-Fi network** as the printer.
2. Open the app you want to print from (Photos, Files, Mail, Safari, most third-party apps).
3. Tap **Share → Print** (sometimes found in the app's overflow menu `...`).
4. The **Printer Options** sheet auto-discovers AirPrint printers. Choose yours, set copies and page range, tap **Print**.

If no printer appears: check both are on the same network (this is the cause almost every time - the phone on 5 GHz and the printer on 2.4 GHz of a *split* network can still be an issue if you use separate SSIDs), restart both, and confirm the printer's wireless light is solid.

Non-AirPrint printers: install the manufacturer's iOS app, which provides its own print dialog.

## Print from Android

1. Confirm phone and printer share the same Wi-Fi.
2. Install **Mopria Print Service** (Play Store) - it supports the vast majority of printers - or the manufacturer's app.
3. In your app's menu, choose **Print**; Android routes through the print service to your printer.
4. Some apps bury it under **Share → Print**, or in Chrome's menu → **Share → Print** for web pages.

Samsung phones include printing built in under **Settings → More connection settings → Printing**. Kindle, Fire and other forked Android systems need the manufacturer's app instead of Mopria.

## Sharing, Guests and "Borrowed" Printers

- **Other people on your network** can add the printer the same way you did - Windows and macOS discover it automatically.
- **Guest network isolation** blocks printing by design: if visitors cannot see your devices, their devices cannot print. Have guests temporarily join your main network, or print through your computer's shared printer.
- **Work computers on a different network** cannot reach a home printer directly. Alternatives: Google Cloud Print's successors (vendor cloud print apps), emailing files to the printer's email address (HP ePrint and similar), or carrying files on USB.
- **VPN conflict:** a VPN on the printing computer can hide local devices. Temporarily disable it to add or use the printer, or configure the VPN's local-network bypass.

## Troubleshooting: Printer Offline

This is the number-one wireless printing complaint, and it has a reliable diagnosis:

1. **Power-cycle:** turn the printer off, wait 15 seconds, turn it on; restart the router if needed. Many "offline" states clear immediately.
2. **Check the connection:** print a network configuration page from the printer's menu - confirm it shows your SSID and a valid IP address.
3. **Same subnet:** the computer and printer must be on the same network. If your router has both 2.4 and 5 GHz networks under different names, both usually share a subnet - but guest networks and AP isolation break this.
4. **Fix the root cause - a stable IP.** In your router's DHCP settings, assign the printer a **static IP / address reservation** by its MAC address, then delete and re-add the printer in Windows or macOS using that fixed address. Now the printer can never "move" and go offline after a router reboot.

In Windows, also open the print queue (**Printers & scanners → select printer → Open queue**) and cancel stuck jobs; a single corrupted job blocks everything behind it.

## Troubleshooting: Printer Not Printing

- **Print queue paused:** open the queue and ensure Printer → Pause Printing is off; click **Resume** if jobs are stacked.
- **Wrong printer selected:** apps remember the last printer; check the name in the print dialog (a second "offline" entry often exists from an old install - remove it in Printers & scanners).
- **Out of ink or paper:** the classic, usually announced by a light on the panel.
- **Driver corruption:** remove the printer entirely, restart, re-add it. On Windows, the Print Management console can also remove stuck drivers.
- **Spooler problems (Windows):** Services → Print Spooler → Restart, then clear `C:\Windows\System32\spool\PRINTERS` if jobs persist.
- **Poor print quality:** run the printer's nozzle/check and alignment utilities; dried ink from disuse is the usual cause - printers need a print at least weekly.

## Troubleshooting: It Won't Join Wi-Fi

- **Wrong band:** many printers only support 2.4 GHz. Use the 2.4 GHz SSID (or a router band that merges both under one name with printer-compatible settings).
- **Password error:** retype carefully using the printer's panel; the printer's keyboard layout hides symbols behind a toggle key.
- **Security mode:** very old printers support WPA2 only - if your router is set to WPA3-only, switch to WPA2/WPA3 mixed mode (settings covered in our [Wi-Fi security guide](/posts/how-to-secure-your-home-wifi-network/)).
- **MAC filtering:** if enabled on the router, add the printer's MAC address to the allowed list.
- **Distance:** pair near the router, then relocate and re-test the connection page.

## Maintenance: Keeping Printing Boring

- Print a page weekly to keep cartridges from drying.
- Update printer firmware through the vendor's app - drivers and firmware fix most "it stopped working after an update" mysteries.
- Re-run network setup after changing your Wi-Fi password or replacing the router - the printer is the device everyone forgets, then blames.
- Keep a note of the printer's model, network name and static IP in your password manager alongside your other hardware details.

## The Bottom Line

Wireless printing is three moves: get the printer on your 2.4 GHz network (WPS, its control panel or the vendor app), add it on each device (auto-discovery on Windows and macOS, AirPrint or Mopria on phones), and make its IP address permanent so it never wanders off the network again. The setup takes twenty minutes once; the static IP takes five more and eliminates the single most common wireless printing complaint. After that, the printer simply prints - which is all anyone ever wanted.
