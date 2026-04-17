import { useFeedModel } from "./FeedModel"
import { FeedView } from "./FeedView"

export function FeedViewModel() {
  const model = useFeedModel()
  return <FeedView {...model} />
}
