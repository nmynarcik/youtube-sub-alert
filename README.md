# YouTube Sub Alert

A [React.js](https://facebook.github.io/react/) Web App that uses the [YouTube Data API](https://developers.google.com/youtube/v3/?hl=en) to retrieve a user's subscriber list and to show the latest. Primarily made for gaming.youtube.com streamers to have a sub alert for their live streams.

## Installation

1. Clone this repo
2. Navigate to this projects root directory and do `npm install`
3. Go to `https://console.developers.google.com` and create an app. Give it permissions for the YouTube Data API
4. Create credentials for the app you created and place them inside `config.json`

## Usage

1. Navigate to the root directory.
2. Run `gulp`
3. Open browser to ```http://127.0.0.1:1337```
4. Click Authenticate Button and allow.
5. Witness the _latest_ subscriber

## Notes

Right now it isn't getting the latest sub. YouTube's Data API doesn't sort them like that. I have an idea in place and plan to update this ASAP.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

[@NathanMynarcik](http://twitter.com/nathanmynarcik) - [www.mynarcik.com](http://www.mynarcik.com)

## License

The MIT License (MIT)

Copyright (c) 2015 Nathan Mynarcik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
