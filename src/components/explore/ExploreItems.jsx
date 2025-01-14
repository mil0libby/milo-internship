import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import Countdown from "../UI/Countdown";
import Skeleton from "react-loading-skeleton";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [defaultItems, setDefaultItems] = useState();
  const [pricesHighLow, setPricesHighLow] = useState([]);
  const [pricesLowHigh, setPricesLowHigh] = useState([]);
  const [likesHighLow, setlikesHighLow] = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const [filter, setFilter] = useState("none");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    let response = await axios.get(
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
    );
    setItems(response.data);
    setDefaultItems(response.data);

    response = await axios.get(
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=likes_high_to_low"
    );

    setlikesHighLow(response.data.reverse());

    response = await axios.get(
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=price_high_to_low"
    );

    setPricesHighLow(response.data.reverse());

    response = await axios.get(
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=price_low_to_high"
    );

    setPricesLowHigh(response.data.reverse());
  };

  const renderSkeletons = () => {
    return (
      <>
        {new Array(8).fill(0).map((_, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <Skeleton borderRadius={10} height={150}></Skeleton>
          </div>
        ))}
      </>
    );
  };

  const handleChange = (event) => {
    const value = event.target.value; // Get the selected value
    setFilter(value); // Update the state
  };

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (filter == "price_high_to_low") {
      setItems(pricesHighLow);
    } else if (filter == "price_low_to_high") {
      setItems(pricesLowHigh);
    } else if (filter == "likes_high_to_low") {
      setItems(likesHighLow);
    } else if (filter == "default") {
      setItems(defaultItems);
    }
  }, [filter]);

  useEffect(() => {}, [loadCount]);
  return (
    <>
      {loading ? (
        renderSkeletons()
      ) : (
        <>
          <div>
            <select
              id="filter-items"
              defaultValue=""
              onChange={(event) => handleChange(event)}
            >
              <option value="default">Default</option>
              <option value="price_low_to_high">Price, Low to High</option>
              <option value="price_high_to_low">Price, High to Low</option>
              <option value="likes_high_to_low">Most liked</option>
            </select>
          </div>
          {items
            .map((item, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to="/author"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                    >
                      <img className="lazy" src={item.authorImage} alt="" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  {item.expiryDate ? (
                    <Countdown timeLeft={item.expiryDate}></Countdown>
                  ) : null}
                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="">
                            <i className="fa fa-envelope fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
            .slice(loadCount > 0 ? (loadCount > 1 ? 0 : 4) : 8)
            .reverse()}
          <div
            className="col-md-12 text-center"
            onClick={() => setLoadCount((prev) => prev + 1)}
          >
            {loadCount < 2 && (
              <Link to="" id="loadmore" className="btn-main lead">
                Load more
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ExploreItems;
