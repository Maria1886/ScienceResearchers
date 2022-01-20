import React from "react"
import { ICatalog } from "../utils/interfaces"
import ArticleAuthor from "./ArticleAuthor";

const Catalog: React.FC<{ catalog: ICatalog, id: number }> = ({ catalog, id }) => {

    return (
        <div className="border border-success rounded p-3 mb-3">
            <div className="row">
                <div className="col-9">
                    <h4>{id + '. ' + catalog.title}</h4>
                </div>
                <div className="col-2">
                    <p>Year: {catalog.year}</p>
                    <p>Type: {catalog.type}</p>
                </div>
                <div className="col-1">
                    <p><a href={catalog.link} className="btn btn-dark btn-sm" target="_blank">Details</a></p>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <h5>{catalog.authors?.length > 1 ? "Authors:" : "Author:"}</h5>
                    <div className="d-flex align-items-start flex-row flex-wrap justify-content-around">
                        {catalog.authors?.map((author, i) =>
                            <ArticleAuthor author={author} key={i} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Catalog;