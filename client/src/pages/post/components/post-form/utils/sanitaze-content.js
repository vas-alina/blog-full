export const sanitazeContent = (content) =>
    content
        .replace(/ +/, ' ')
        .replaceAll("<div><br></div>", "\n")
        .replaceAll("<div>", "\n")
        .replaceAll("</div>", ' ')
