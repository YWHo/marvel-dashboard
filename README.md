## Live Website

https://marvel-dashboard-ten.vercel.app/

## Running project locally

1. Install pnpm on your local computer by visiting the following website: \
 https://pnpm.io/installation.

2. Open the terminal on your local computer and clone this project:
```console
git clone https://github.com/YWHo/marvel-dashboard.git
```

3. Navigate to the `marvel-dashboard` directory.

<del>4. Create a .env.local file in the root directory of the project and add the API key to it.</del>

<del>  MARVEL_ACCESS_PUBLIC_KEY=<your public API key> </del>
<del>  MARVEL_ACCESS_PRIVATE_KEY=<your private API key> </del>

<del> Note: Please obtain your API key from https://developer.marvel.com/.~~
</del>

4. The official Marvel API has been shut down and is no longer available. This app is currently using an unofficial alternative API at [https://marvel.emreparker.com](https://marvel.emreparker.com). The source code for the alternative API is available at [https://github.com/emreparker/marvel-comics](https://github.com/emreparker/marvel-comics).

I greatly appreciate the work of its creator, which allows my demo app to continue functioning.

For more information about the shutdown and the alternative API, see the Reddit discussion:
[https://www.reddit.com/r/MarvelUnlimited/comments/1jfwfe0/marvel_api_down/](https://www.reddit.com/r/MarvelUnlimited/comments/1jfwfe0/marvel_api_down/)


5. Run the `pnpm install` command to retrieve the project dependencies.
```console
pnpm install
```

6. Start the development server on your local computer:

```console
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

8. To create a production build, please run the following commands:

```console
pnpm build
```

followed by

```console
pnpm start.
```