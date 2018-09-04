# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

MFILE="$1"

# Delete old index if exists
curl -XDELETE "$ES_URL/insight-generator-measurements"

echo "Creating Insight Generator Measurements Index"
curl -XPOST "$ES_URL/insight-generator-measurements"

echo "Adding Measurements Mapping for Insight Generator Measurements Index"
curl -XPOST "$ES_URL/insight-generator-measurements/raw-measurements/_mapping" -d @'di-measurements-schema.json'

echo "Ingesting curated measurements for Insight Generator"
curl -XPOST "$ES_URL/insight-generator-measurements/raw-measurements" -d@"$MFILE"

