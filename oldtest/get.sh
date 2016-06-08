curl -XGET 'localhost:9200/elasticgoose/simple/_search?pretty=true' -d '
{
    "query" : {
        "match_all" : {}
    }
}'
