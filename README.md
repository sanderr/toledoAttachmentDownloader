# KULeuven Toledo Attachment Downloader (unofficial)

This is a Firefox and Chrome extension that makes it easy to download all attachments on a course page in one click.
The current version does not go into subdirectories.

## Installation
### Firefox
The add-on is available at https://addons.mozilla.org/en-US/firefox/addon/kul-toledo-attachment-download/

### Chrome
Because Chrome requires a developer signup fee to publish extensions, I have not published it there. This will make the
installation procedure a little harder.

Clone this project, then go to chrome://extensions and click "Load unpacked extension...". Navigate to the extension root directory
(the one with manifest.json in it) and click "Open". Do not remove this directory, as this will remove the extension from Chrome.
To update an extension installed this way, pull the updated code from the repository, then go to chrome://extensions and click "Reload"
below the extension you want to update.

## Usage
When you are on a "Course Documents" page, click on the extension icon. The extension will download all attachments,
zip them and show a download dialog for the zip file. Please wait for the dialog to appear before closing the
extension popup window, as this will stop the download.
