import {Anchor} from "@mui/icons-material";
type Props = {
    page: string;
    selectedPage: string;
    setSelectedPage: (value: string) => void;
}
const Link   = ({
    page,
    selectedPage, 
    setSelectedPage,
     }: Props) => {
    const lowerCasePage = page.toLowerCase().replace(/ /g, "");
        
    return (
        <Anchor
            className={`${selectedPage === lowerCasePage ? "text-primary-500" : ""} 
            transition duration-500 hover:text-primary-300
            `}
        href={'#${lowerCasePage}'}
        onClick={() => setSelectedPage(lowerCasePage)}
        >
            {page}
        </Anchor>
    )
}
export default Link;